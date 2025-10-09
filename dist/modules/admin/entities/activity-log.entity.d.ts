import { User } from '../../auth/entities/user.entity';
export declare class ActivityLog {
    id: string;
    userId: string;
    user: User;
    activityType: string;
    metadata: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
