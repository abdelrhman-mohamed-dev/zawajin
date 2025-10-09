import { DataSource, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
export declare class ConversationRepository extends Repository<Conversation> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByParticipants(userId1: string, userId2: string): Promise<Conversation | null>;
    findUserConversations(userId: string, page?: number, limit?: number): Promise<[Conversation[], number]>;
    updateLastMessage(conversationId: string, messagePreview: string, messageDate: Date): Promise<void>;
}
