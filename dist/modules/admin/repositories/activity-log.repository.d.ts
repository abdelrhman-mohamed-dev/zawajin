import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';
export declare class ActivityLogRepository {
    private readonly repository;
    constructor(repository: Repository<ActivityLog>);
    create(logData: Partial<ActivityLog>): Promise<ActivityLog>;
    findByUserId(userId: string, page?: number, limit?: number): Promise<{
        logs: ActivityLog[];
        total: number;
    }>;
    findByActivityType(activityType: string, page?: number, limit?: number): Promise<{
        logs: ActivityLog[];
        total: number;
    }>;
    getRecentActivity(days?: number): Promise<{
        activityType: string;
        count: string;
    }[]>;
}
