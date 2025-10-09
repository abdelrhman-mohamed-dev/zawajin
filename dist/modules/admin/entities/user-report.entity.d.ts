import { User } from '../../auth/entities/user.entity';
import { Conversation } from '../../chat/entities/conversation.entity';
export declare class UserReport {
    id: string;
    reporterId: string;
    reporter: User;
    reportedUserId: string;
    reportedUser: User;
    reportType: string;
    description: string;
    evidence: Record<string, any>;
    conversationId: string;
    conversation: Conversation;
    status: string;
    priority: string;
    reviewedBy: string;
    reviewer: User;
    reviewedAt: Date;
    resolution: string;
    actionTaken: string;
    createdAt: Date;
    updatedAt: Date;
}
