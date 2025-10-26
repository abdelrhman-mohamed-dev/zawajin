import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationRepository } from '../repositories/conversation.repository';
import { MessageRepository } from '../repositories/message.repository';
import { UserPresenceRepository } from '../repositories/user-presence.repository';
import { EngagementRequestRepository } from '../repositories/engagement-request.repository';
import { Conversation } from '../entities/conversation.entity';
import { Message, MessageType, MessageStatus } from '../entities/message.entity';
import { EngagementRequest, EngagementStatus } from '../entities/engagement-request.entity';
import { Like } from '../../interactions/entities/like.entity';
import { Block } from '../../interactions/entities/block.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { SendEngagementDto } from '../dto/send-engagement.dto';
import { RespondEngagementDto } from '../dto/respond-engagement.dto';

@Injectable()
export class ChatService {
  constructor(
    private conversationRepository: ConversationRepository,
    private messageRepository: MessageRepository,
    private userPresenceRepository: UserPresenceRepository,
    private engagementRequestRepository: EngagementRequestRepository,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
  ) {}

  async createConversation(
    userId: string,
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const { recipientId } = createConversationDto;

    // Validate not self
    if (userId === recipientId) {
      throw new BadRequestException({
        message: 'Cannot create conversation with yourself',
        messageAr: 'لا يمكن إنشاء محادثة مع نفسك',
      });
    }

    // Check if users are blocked
    const isBlocked = await this.blockRepository.findOne({
      where: [
        { blockerId: userId, blockedId: recipientId },
        { blockerId: recipientId, blockedId: userId },
      ],
    });

    if (isBlocked) {
      throw new ForbiddenException({
        message: 'Cannot create conversation with blocked user',
        messageAr: 'لا يمكن إنشاء محادثة مع مستخدم محظور',
      });
    }

    // Check for mutual like (match) - optional, for reference only
    const mutualLike = await this.checkMutualLike(userId, recipientId);

    // Check if conversation already exists
    const existingConversation =
      await this.conversationRepository.findByParticipants(userId, recipientId);

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversation = this.conversationRepository.create({
      participant1Id: userId,
      participant2Id: recipientId,
      matchId: mutualLike?.id || null, // Store match ID if exists, null otherwise
    });

    return this.conversationRepository.save(conversation);
  }

  async getUserConversations(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ conversations: any[]; total: number; page: number; totalPages: number }> {
    const [conversations, total] =
      await this.conversationRepository.findUserConversations(
        userId,
        page,
        limit,
      );

    // Get all unique participant IDs
    const participantIds = new Set<string>();
    conversations.forEach(conv => {
      if (conv.participant1?.id) participantIds.add(conv.participant1.id);
      if (conv.participant2?.id) participantIds.add(conv.participant2.id);
    });

    // Get online status for all participants
    const presencePromises = Array.from(participantIds).map(id =>
      this.userPresenceRepository.getUserPresence(id)
    );
    const presences = await Promise.all(presencePromises);
    const presenceMap = new Map(
      Array.from(participantIds).map((id, index) => [
        id,
        {
          isOnline: presences[index] ? presences[index].isOnline : true,
          lastSeenAt: presences[index] ? presences[index].lastSeenAt : null
        }
      ])
    );

    // Get unread message counts for all conversations
    const unreadCountPromises = conversations.map(conv =>
      this.messageRepository.getUnreadCount(conv.id, userId)
    );
    const unreadCounts = await Promise.all(unreadCountPromises);

    // Add online status and unread count to participants
    const conversationsWithPresence = conversations.map((conv, index) => {
      const participant1Presence = conv.participant1 ? presenceMap.get(conv.participant1.id) : null;
      const participant2Presence = conv.participant2 ? presenceMap.get(conv.participant2.id) : null;

      return {
        ...conv,
        participant1: conv.participant1 ? {
          ...conv.participant1,
          isOnline: participant1Presence?.isOnline ?? true,
          lastSeenAt: participant1Presence?.lastSeenAt ?? null,
        } : null,
        participant2: conv.participant2 ? {
          ...conv.participant2,
          isOnline: participant2Presence?.isOnline ?? true,
          lastSeenAt: participant2Presence?.lastSeenAt ?? null,
        } : null,
        unreadCount: unreadCounts[index] || 0,
      };
    });

    return {
      conversations: conversationsWithPresence,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getConversationById(
    userId: string,
    conversationId: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['participant1', 'participant2'],
    });

    if (!conversation) {
      throw new NotFoundException({
        message: 'Conversation not found',
        messageAr: 'المحادثة غير موجودة',
      });
    }

    // Check if user is participant
    if (!conversation.isParticipant(userId)) {
      throw new ForbiddenException({
        message: 'You are not a participant in this conversation',
        messageAr: 'أنت لست مشاركًا في هذه المحادثة',
      });
    }

    return conversation;
  }

  async getConversationMessages(
    userId: string,
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ messages: Message[]; total: number; page: number; totalPages: number }> {
    // Verify user has access to conversation
    await this.getConversationById(userId, conversationId);

    const [messages, total] = await this.messageRepository.findByConversationId(
      conversationId,
      page,
      limit,
    );

    // Mark messages as delivered if not already
    const messageIds = messages
      .filter((m) => m.senderId !== userId && m.status === MessageStatus.SENT)
      .map((m) => m.id);

    if (messageIds.length > 0) {
      await this.messageRepository.markAsDelivered(messageIds);
    }

    return {
      messages: messages.reverse(), // Reverse to show oldest first
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<Message> {
    const conversation = await this.getConversationById(userId, conversationId);

    // Check if users are still not blocked
    const recipientId = conversation.getOtherParticipantId(userId);
    const isBlocked = await this.blockRepository.findOne({
      where: [
        { blockerId: userId, blockedId: recipientId },
        { blockerId: recipientId, blockedId: userId },
      ],
    });

    if (isBlocked) {
      throw new ForbiddenException({
        message: 'Cannot send message to blocked user',
        messageAr: 'لا يمكن إرسال رسالة إلى مستخدم محظور',
      });
    }

    // Create message
    const message = this.messageRepository.create({
      conversationId,
      senderId: userId,
      content: sendMessageDto.content,
      messageType: sendMessageDto.messageType || MessageType.TEXT,
      fileUrl: sendMessageDto.fileUrl || null,
      audioDuration: sendMessageDto.audioDuration || null,
      status: MessageStatus.SENT,
      createdAt: new Date(), // Explicitly set to current UTC time
      updatedAt: new Date(),
    });

    const savedMessage = await this.messageRepository.save(message);

    // Log the timestamp for debugging
    console.log('Message saved with timestamp:', savedMessage.createdAt);
    console.log('Current server time:', new Date().toISOString());

    // Update conversation's last message
    const preview =
      sendMessageDto.content.length > 100
        ? sendMessageDto.content.substring(0, 100) + '...'
        : sendMessageDto.content;

    await this.conversationRepository.updateLastMessage(
      conversationId,
      preview,
      savedMessage.createdAt,
    );

    return savedMessage;
  }

  async markMessagesAsRead(
    userId: string,
    conversationId: string,
  ): Promise<void> {
    // Verify user has access to conversation
    await this.getConversationById(userId, conversationId);

    // Get unread messages sent by the other user
    const unreadMessages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.status != :status', { status: MessageStatus.READ })
      .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
      .getMany();

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map((m) => m.id);
      await this.messageRepository.markAsRead(messageIds);
    }
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException({
        message: 'Message not found',
        messageAr: 'الرسالة غير موجودة',
      });
    }

    // Only sender can delete their message
    if (message.senderId !== userId) {
      throw new ForbiddenException({
        message: 'You can only delete your own messages',
        messageAr: 'يمكنك فقط حذف رسائلك الخاصة',
      });
    }

    await this.messageRepository.softDeleteMessage(messageId);
  }

  async deleteConversation(
    userId: string,
    conversationId: string,
  ): Promise<void> {
    // Verify user has access to conversation
    const conversation = await this.getConversationById(userId, conversationId);

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
  }

  async getUnreadCount(
    userId: string,
    conversationId: string,
  ): Promise<number> {
    // Verify user has access to conversation
    await this.getConversationById(userId, conversationId);

    return this.messageRepository.getUnreadCount(conversationId, userId);
  }

  async getUserPresence(userId: string): Promise<any> {
    const presence = await this.userPresenceRepository.getUserPresence(userId);
    if (!presence) {
      return {
        userId,
        isOnline: false,
        lastSeenAt: null,
      };
    }
    return {
      userId: presence.userId,
      isOnline: presence.isOnline,
      lastSeenAt: presence.lastSeenAt,
    };
  }

  private async checkMutualLike(
    userId1: string,
    userId2: string,
  ): Promise<Like | null> {
    // Check if user1 likes user2
    const like1 = await this.likeRepository.findOne({
      where: { userId: userId1, likedUserId: userId2 },
    });

    // Check if user2 likes user1
    const like2 = await this.likeRepository.findOne({
      where: { userId: userId2, likedUserId: userId1 },
    });

    // Return the first like as match ID if both exist
    return like1 && like2 ? like1 : null;
  }

  // ======================== ENGAGEMENT METHODS ========================

  async sendEngagementRequest(
    userId: string,
    sendEngagementDto: SendEngagementDto,
  ): Promise<EngagementRequest> {
    const { recipientId, conversationId, message } = sendEngagementDto;

    // Validate not self
    if (userId === recipientId) {
      throw new BadRequestException({
        message: 'Cannot send engagement request to yourself',
        messageAr: 'لا يمكن إرسال طلب خطوبة لنفسك',
      });
    }

    // Verify conversation exists and user is participant
    const conversation = await this.getConversationById(userId, conversationId);

    // Verify recipient is the other participant
    const otherParticipantId = conversation.getOtherParticipantId(userId);
    if (otherParticipantId !== recipientId) {
      throw new BadRequestException({
        message: 'Recipient must be the other participant in the conversation',
        messageAr: 'يجب أن يكون المستلم هو المشارك الآخر في المحادثة',
      });
    }

    // Check if users are blocked
    const isBlocked = await this.blockRepository.findOne({
      where: [
        { blockerId: userId, blockedId: recipientId },
        { blockerId: recipientId, blockedId: userId },
      ],
    });

    if (isBlocked) {
      throw new ForbiddenException({
        message: 'Cannot send engagement request to blocked user',
        messageAr: 'لا يمكن إرسال طلب خطوبة إلى مستخدم محظور',
      });
    }

    // Check for existing pending request
    const existingRequest =
      await this.engagementRequestRepository.findPendingRequestBetweenUsers(
        userId,
        recipientId,
      );

    if (existingRequest) {
      throw new ConflictException({
        message: 'You already have a pending engagement request with this user',
        messageAr: 'لديك بالفعل طلب خطوبة معلق مع هذا المستخدم',
      });
    }

    // Check if recipient has sent a pending request to sender
    const recipientRequest =
      await this.engagementRequestRepository.findPendingRequestBetweenUsers(
        recipientId,
        userId,
      );

    if (recipientRequest) {
      throw new ConflictException({
        message: 'This user has already sent you an engagement request',
        messageAr: 'أرسل لك هذا المستخدم بالفعل طلب خطوبة',
      });
    }

    // Create engagement request
    const engagementRequest = this.engagementRequestRepository.create({
      senderId: userId,
      recipientId,
      conversationId,
      message,
      status: EngagementStatus.PENDING,
    });

    return this.engagementRequestRepository.save(engagementRequest);
  }

  async respondToEngagementRequest(
    userId: string,
    requestId: string,
    respondDto: RespondEngagementDto,
  ): Promise<EngagementRequest> {
    const request = await this.engagementRequestRepository.findRequestById(
      requestId,
      userId,
    );

    if (!request) {
      throw new NotFoundException({
        message: 'Engagement request not found',
        messageAr: 'طلب الخطوبة غير موجود',
      });
    }

    // Only recipient can respond
    if (request.recipientId !== userId) {
      throw new ForbiddenException({
        message: 'Only the recipient can respond to this request',
        messageAr: 'يمكن للمستلم فقط الرد على هذا الطلب',
      });
    }

    // Check if already responded
    if (request.status !== EngagementStatus.PENDING) {
      throw new BadRequestException({
        message: 'This engagement request has already been responded to',
        messageAr: 'تم الرد على طلب الخطوبة هذا بالفعل',
      });
    }

    // Update status
    request.status = respondDto.status;
    request.respondedAt = new Date();

    return this.engagementRequestRepository.save(request);
  }

  async cancelEngagementRequest(
    userId: string,
    requestId: string,
  ): Promise<void> {
    const request = await this.engagementRequestRepository.findRequestById(
      requestId,
      userId,
    );

    if (!request) {
      throw new NotFoundException({
        message: 'Engagement request not found',
        messageAr: 'طلب الخطوبة غير موجود',
      });
    }

    // Only sender can cancel
    if (request.senderId !== userId) {
      throw new ForbiddenException({
        message: 'Only the sender can cancel this request',
        messageAr: 'يمكن للمرسل فقط إلغاء هذا الطلب',
      });
    }

    // Can only cancel pending requests
    if (request.status !== EngagementStatus.PENDING) {
      throw new BadRequestException({
        message: 'Can only cancel pending engagement requests',
        messageAr: 'يمكن فقط إلغاء طلبات الخطوبة المعلقة',
      });
    }

    request.status = EngagementStatus.CANCELLED;
    await this.engagementRequestRepository.save(request);
  }

  async getSentEngagementRequests(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ requests: EngagementRequest[]; total: number; page: number; totalPages: number }> {
    const [requests, total] =
      await this.engagementRequestRepository.findUserSentRequests(
        userId,
        page,
        limit,
      );

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getReceivedEngagementRequests(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ requests: EngagementRequest[]; total: number; page: number; totalPages: number }> {
    const [requests, total] =
      await this.engagementRequestRepository.findUserReceivedRequests(
        userId,
        page,
        limit,
      );

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPendingEngagementRequests(
    userId: string,
  ): Promise<EngagementRequest[]> {
    return this.engagementRequestRepository.findPendingReceivedRequests(userId);
  }

  async getEngagementRequestById(
    userId: string,
    requestId: string,
  ): Promise<EngagementRequest> {
    const request = await this.engagementRequestRepository.findRequestById(
      requestId,
      userId,
    );

    if (!request) {
      throw new NotFoundException({
        message: 'Engagement request not found',
        messageAr: 'طلب الخطوبة غير موجود',
      });
    }

    return request;
  }

  async getConversationEngagementRequests(
    userId: string,
    conversationId: string,
  ): Promise<EngagementRequest[]> {
    // Verify user has access to conversation
    await this.getConversationById(userId, conversationId);

    return this.engagementRequestRepository.findByConversation(conversationId);
  }

  async getPendingEngagementCount(userId: string): Promise<number> {
    return this.engagementRequestRepository.countPendingReceivedRequests(userId);
  }
}
