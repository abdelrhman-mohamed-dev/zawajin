import { User } from '../../auth/entities/user.entity';
export declare class AdminNotification {
    id: string;
    recipientId: string;
    recipient: User;
    senderId: string;
    sender: User;
    subject: string;
    message: string;
    notificationType: string;
    status: string;
    sentAt: Date;
    createdAt: Date;
}
