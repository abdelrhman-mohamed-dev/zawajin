import { Conversation } from './conversation.entity';
import { User } from '../../auth/entities/user.entity';
export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    SYSTEM = "system"
}
export declare enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read"
}
export declare class Message {
    id: string;
    conversationId: string;
    conversation: Conversation;
    senderId: string;
    sender: User;
    content: string;
    messageType: MessageType;
    status: MessageStatus;
    isDeleted: boolean;
    deletedAt: Date;
    readAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
