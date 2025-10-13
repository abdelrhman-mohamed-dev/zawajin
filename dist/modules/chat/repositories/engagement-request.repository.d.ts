import { DataSource, Repository } from 'typeorm';
import { EngagementRequest } from '../entities/engagement-request.entity';
export declare class EngagementRequestRepository extends Repository<EngagementRequest> {
    private dataSource;
    constructor(dataSource: DataSource);
    findPendingRequestBetweenUsers(senderId: string, recipientId: string): Promise<EngagementRequest | null>;
    findRequestById(requestId: string, userId: string): Promise<EngagementRequest | null>;
    findUserSentRequests(userId: string, page?: number, limit?: number): Promise<[EngagementRequest[], number]>;
    findUserReceivedRequests(userId: string, page?: number, limit?: number): Promise<[EngagementRequest[], number]>;
    findPendingReceivedRequests(userId: string): Promise<EngagementRequest[]>;
    countPendingReceivedRequests(userId: string): Promise<number>;
    findByConversation(conversationId: string): Promise<EngagementRequest[]>;
}
