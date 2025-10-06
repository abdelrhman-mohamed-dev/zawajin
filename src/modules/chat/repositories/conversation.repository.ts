import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ConversationRepository extends Repository<Conversation> {
  constructor(private dataSource: DataSource) {
    super(Conversation, dataSource.createEntityManager());
  }

  async findByParticipants(
    userId1: string,
    userId2: string,
  ): Promise<Conversation | null> {
    return this.createQueryBuilder('conversation')
      .where(
        '(conversation.participant1Id = :userId1 AND conversation.participant2Id = :userId2) OR (conversation.participant1Id = :userId2 AND conversation.participant2Id = :userId1)',
        { userId1, userId2 },
      )
      .getOne();
  }

  async findUserConversations(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<[Conversation[], number]> {
    const skip = (page - 1) * limit;

    return this.createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participant1', 'participant1')
      .leftJoinAndSelect('conversation.participant2', 'participant2')
      .where(
        'conversation.participant1Id = :userId OR conversation.participant2Id = :userId',
        { userId },
      )
      .orderBy('conversation.lastMessageAt', 'DESC', 'NULLS LAST')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  }

  async updateLastMessage(
    conversationId: string,
    messagePreview: string,
    messageDate: Date,
  ): Promise<void> {
    await this.update(conversationId, {
      lastMessagePreview: messagePreview,
      lastMessageAt: messageDate,
    });
  }
}
