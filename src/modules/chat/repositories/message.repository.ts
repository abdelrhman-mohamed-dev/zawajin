import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Message, MessageStatus } from '../entities/message.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(private dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }

  async findByConversationId(
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<[Message[], number]> {
    const skip = (page - 1) * limit;

    return this.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('message.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  }

  async markAsDelivered(messageIds: string[]): Promise<void> {
    await this.createQueryBuilder()
      .update(Message)
      .set({ status: MessageStatus.DELIVERED })
      .where('id IN (:...messageIds)', { messageIds })
      .andWhere('status = :status', { status: MessageStatus.SENT })
      .execute();
  }

  async markAsRead(messageIds: string[]): Promise<void> {
    await this.createQueryBuilder()
      .update(Message)
      .set({
        status: MessageStatus.READ,
        readAt: new Date(),
      })
      .where('id IN (:...messageIds)', { messageIds })
      .andWhere('status != :status', { status: MessageStatus.READ })
      .execute();
  }

  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    return this.createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.status != :status', { status: MessageStatus.READ })
      .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
      .getCount();
  }

  async softDeleteMessage(messageId: string): Promise<void> {
    await this.update(messageId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}
