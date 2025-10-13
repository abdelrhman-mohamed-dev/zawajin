import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EngagementRequest, EngagementStatus } from '../entities/engagement-request.entity';

@Injectable()
export class EngagementRequestRepository extends Repository<EngagementRequest> {
  constructor(private dataSource: DataSource) {
    super(EngagementRequest, dataSource.createEntityManager());
  }

  async findPendingRequestBetweenUsers(
    senderId: string,
    recipientId: string,
  ): Promise<EngagementRequest | null> {
    return this.findOne({
      where: {
        senderId,
        recipientId,
        status: EngagementStatus.PENDING,
      },
      relations: ['sender', 'recipient', 'conversation'],
    });
  }

  async findRequestById(
    requestId: string,
    userId: string,
  ): Promise<EngagementRequest | null> {
    return this.createQueryBuilder('request')
      .leftJoinAndSelect('request.sender', 'sender')
      .leftJoinAndSelect('request.recipient', 'recipient')
      .leftJoinAndSelect('request.conversation', 'conversation')
      .where('request.id = :requestId', { requestId })
      .andWhere('(request.senderId = :userId OR request.recipientId = :userId)', {
        userId,
      })
      .getOne();
  }

  async findUserSentRequests(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<[EngagementRequest[], number]> {
    return this.findAndCount({
      where: { senderId: userId },
      relations: ['recipient', 'conversation'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findUserReceivedRequests(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<[EngagementRequest[], number]> {
    return this.findAndCount({
      where: { recipientId: userId },
      relations: ['sender', 'conversation'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findPendingReceivedRequests(
    userId: string,
  ): Promise<EngagementRequest[]> {
    return this.find({
      where: {
        recipientId: userId,
        status: EngagementStatus.PENDING,
      },
      relations: ['sender', 'conversation'],
      order: { createdAt: 'DESC' },
    });
  }

  async countPendingReceivedRequests(userId: string): Promise<number> {
    return this.count({
      where: {
        recipientId: userId,
        status: EngagementStatus.PENDING,
      },
    });
  }

  async findByConversation(conversationId: string): Promise<EngagementRequest[]> {
    return this.find({
      where: { conversationId },
      relations: ['sender', 'recipient'],
      order: { createdAt: 'DESC' },
    });
  }
}
