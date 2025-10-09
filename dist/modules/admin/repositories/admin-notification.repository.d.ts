import { Repository } from 'typeorm';
import { AdminNotification } from '../entities/admin-notification.entity';
export declare class AdminNotificationRepository {
    private readonly repository;
    constructor(repository: Repository<AdminNotification>);
    create(notificationData: Partial<AdminNotification>): Promise<AdminNotification>;
    findById(id: string): Promise<AdminNotification | null>;
    findByRecipient(recipientId: string, page?: number, limit?: number): Promise<{
        notifications: AdminNotification[];
        total: number;
    }>;
    update(id: string, updateData: Partial<AdminNotification>): Promise<AdminNotification | null>;
}
