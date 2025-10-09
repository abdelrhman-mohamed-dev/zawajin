import { DataSource, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
export declare class MessageRepository extends Repository<Message> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByConversationId(conversationId: string, page?: number, limit?: number): Promise<[Message[], number]>;
    markAsDelivered(messageIds: string[]): Promise<void>;
    markAsRead(messageIds: string[]): Promise<void>;
    getUnreadCount(conversationId: string, userId: string): Promise<number>;
    softDeleteMessage(messageId: string): Promise<void>;
}
