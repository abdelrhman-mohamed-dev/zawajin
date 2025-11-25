import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like as TypeOrmLike, In } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Conversation } from '../../chat/entities/conversation.entity';
import { Message } from '../../chat/entities/message.entity';
import { UserReport } from '../entities/user-report.entity';
import { AdminActionRepository } from '../repositories/admin-action.repository';
import { AdminChatFilterDto, ChatFilterStatus } from '../dto/admin-chat-filter.dto';
import { AdminCloseConversationDto } from '../dto/admin-close-conversation.dto';
import { AdminDeleteMessageDto } from '../dto/admin-delete-message.dto';
import { ConversationRepository } from '../../chat/repositories/conversation.repository';
import { MessageRepository } from '../../chat/repositories/message.repository';

@Injectable()
export class AdminChatService {
  constructor(
    private conversationRepository: ConversationRepository,
    private messageRepository: MessageRepository,
    @InjectRepository(UserReport)
    private userReportRepository: Repository<UserReport>,
    private adminActionRepository: AdminActionRepository,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Get all conversations with advanced filtering
   */
  async getAllConversations(filters: AdminChatFilterDto, lang: string = 'en') {
    const { page = 1, limit = 20, search, status, startDate, endDate, hasReports } = filters;

    const queryBuilder = this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participant1', 'participant1')
      .leftJoinAndSelect('conversation.participant2', 'participant2')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .orderBy('conversation.lastMessageAt', 'DESC');

    // Search by participant name or email
    if (search) {
      queryBuilder.andWhere(
        '(participant1.fullName ILIKE :search OR participant1.email ILIKE :search OR participant2.fullName ILIKE :search OR participant2.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      queryBuilder.andWhere('conversation.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    // Filter by status (reported conversations)
    if (hasReports) {
      const reportedConversationIds = await this.userReportRepository
        .createQueryBuilder('report')
        .select('DISTINCT report.reportedUserId')
        .where('report.status = :status', { status: 'pending' })
        .getMany()
        .then(reports => reports.map(r => r.reportedUserId));

      if (reportedConversationIds.length > 0) {
        queryBuilder.andWhere(
          '(conversation.participant1Id IN (:...reportedIds) OR conversation.participant2Id IN (:...reportedIds))',
          { reportedIds: reportedConversationIds },
        );
      }
    }

    const [conversations, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Get message counts for each conversation
    const conversationsWithStats = await Promise.all(
      conversations.map(async (conv) => {
        const messageCount = await this.messageRepository.count({
          where: { conversationId: conv.id, isDeleted: false },
        });

        const reportCount = await this.userReportRepository.count({
          where: [
            { reportedUserId: conv.participant1Id },
            { reportedUserId: conv.participant2Id },
          ],
        });

        return {
          ...conv,
          messageCount,
          reportCount,
        };
      }),
    );

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.conversationsFetched', { lang }),
      data: {
        conversations: conversationsWithStats,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get detailed conversation by ID
   */
  async getConversationById(conversationId: string, lang: string = 'en') {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participant1', 'participant2', 'messages', 'messages.sender'],
    });

    if (!conversation) {
      throw new NotFoundException({
        message: await this.i18n.translate('admin.errors.conversationNotFound', { lang }),
        messageAr: 'المحادثة غير موجودة',
      });
    }

    // Get reports related to this conversation's participants
    const reports = await this.userReportRepository.find({
      where: [
        { reportedUserId: conversation.participant1Id },
        { reportedUserId: conversation.participant2Id },
      ],
      relations: ['reporter', 'reportedUser'],
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.conversationFetched', { lang }),
      data: {
        ...conversation,
        reports,
      },
    };
  }

  /**
   * Get all messages from a conversation
   */
  async getConversationMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50,
    lang: string = 'en',
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException({
        message: await this.i18n.translate('admin.errors.conversationNotFound', { lang }),
        messageAr: 'المحادثة غير موجودة',
      });
    }

    const [messages, total] = await this.messageRepository.findByConversationId(
      conversationId,
      page,
      limit,
    );

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.messagesFetched', { lang }),
      data: {
        messages: messages.reverse(),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete a specific message (admin override)
   */
  async deleteMessage(
    messageId: string,
    adminId: string,
    deleteDto: AdminDeleteMessageDto,
    lang: string = 'en',
  ) {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['conversation', 'sender'],
    });

    if (!message) {
      throw new NotFoundException({
        message: await this.i18n.translate('admin.errors.messageNotFound', { lang }),
        messageAr: 'الرسالة غير موجودة',
      });
    }

    // Soft delete the message
    await this.messageRepository.softDeleteMessage(messageId);

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'delete_user', // Using existing enum value
      targetUserId: message.senderId,
      targetId: messageId,
      reason: `Deleted message. Reason: ${deleteDto.reason}`,
      metadata: {
        messageContent: message.content,
        conversationId: message.conversationId,
        action: 'delete_message',
      },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.messageDeleted', { lang }),
      data: { messageId },
    };
  }

  /**
   * Close/delete a conversation (admin override)
   */
  async closeConversation(
    conversationId: string,
    adminId: string,
    closeDto: AdminCloseConversationDto,
    lang: string = 'en',
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participant1', 'participant2'],
    });

    if (!conversation) {
      throw new NotFoundException({
        message: await this.i18n.translate('admin.errors.conversationNotFound', { lang }),
        messageAr: 'المحادثة غير موجودة',
      });
    }

    // Delete all messages in the conversation
    await this.messageRepository.delete({ conversationId });

    // Update conversation to clear last message info
    await this.conversationRepository.update(
      { id: conversationId },
      {
        lastMessagePreview: null,
        lastMessageAt: null,
      },
    );

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'delete_user', // Using existing enum value
      targetUserId: conversation.participant1Id,
      targetId: conversationId,
      reason: `Closed conversation. Reason: ${closeDto.reason}`,
      metadata: {
        participant1Id: conversation.participant1Id,
        participant2Id: conversation.participant2Id,
        participant1Name: conversation.participant1.fullName,
        participant2Name: conversation.participant2.fullName,
        action: 'close_conversation',
      },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.conversationClosed', { lang }),
      data: { conversationId },
    };
  }

  /**
   * Get chat statistics
   */
  async getChatStatistics(lang: string = 'en') {
    const totalConversations = await this.conversationRepository.count();
    const activeConversations = await this.conversationRepository.count({
      where: {
        lastMessageAt: Between(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date(),
        ),
      },
    });

    const totalMessages = await this.messageRepository.count();
    const deletedMessages = await this.messageRepository.count({
      where: { isDeleted: true },
    });

    const reportedConversations = await this.userReportRepository
      .createQueryBuilder('report')
      .select('COUNT(DISTINCT report.reportedUserId)', 'count')
      .where('report.status = :status', { status: 'pending' })
      .getRawOne();

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.statisticsFetched', { lang }),
      data: {
        totalConversations,
        activeConversations,
        totalMessages,
        deletedMessages,
        reportedConversations: parseInt(reportedConversations?.count || '0'),
      },
    };
  }

  /**
   * Search messages across all conversations
   */
  async searchMessages(
    searchQuery: string,
    page: number = 1,
    limit: number = 50,
    lang: string = 'en',
  ) {
    const [messages, total] = await this.messageRepository.findAndCount({
      where: {
        content: TypeOrmLike(`%${searchQuery}%`),
        isDeleted: false,
      },
      relations: ['sender', 'conversation', 'conversation.participant1', 'conversation.participant2'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.messagesFetched', { lang }),
      data: {
        messages,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get reported conversations
   */
  async getReportedConversations(page: number = 1, limit: number = 20, lang: string = 'en') {
    // Get all reported user IDs
    const reports = await this.userReportRepository.find({
      where: { status: 'pending' },
      relations: ['reportedUser', 'reporter'],
    });

    const reportedUserIds = [...new Set(reports.map(r => r.reportedUserId))];

    if (reportedUserIds.length === 0) {
      return {
        success: true,
        message: await this.i18n.translate('admin.messages.conversationsFetched', { lang }),
        data: {
          conversations: [],
          total: 0,
          page,
          totalPages: 0,
        },
      };
    }

    const [conversations, total] = await this.conversationRepository.findAndCount({
      where: [
        { participant1Id: In(reportedUserIds) },
        { participant2Id: In(reportedUserIds) },
      ],
      relations: ['participant1', 'participant2'],
      order: { lastMessageAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Attach reports to each conversation
    const conversationsWithReports = conversations.map(conv => ({
      ...conv,
      reports: reports.filter(
        r => r.reportedUserId === conv.participant1Id || r.reportedUserId === conv.participant2Id,
      ),
    }));

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.conversationsFetched', { lang }),
      data: {
        conversations: conversationsWithReports,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
