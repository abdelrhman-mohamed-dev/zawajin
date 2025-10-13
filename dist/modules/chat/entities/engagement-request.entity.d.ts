import { User } from '../../auth/entities/user.entity';
import { Conversation } from './conversation.entity';
export declare enum EngagementStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REFUSED = "refused",
    CANCELLED = "cancelled"
}
export declare class EngagementRequest {
    id: string;
    senderId: string;
    sender: User;
    recipientId: string;
    recipient: User;
    conversationId: string;
    conversation: Conversation;
    status: EngagementStatus;
    message: string;
    respondedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
