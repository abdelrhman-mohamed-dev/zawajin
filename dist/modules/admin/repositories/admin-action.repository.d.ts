import { Repository } from 'typeorm';
import { AdminAction } from '../entities/admin-action.entity';
export declare class AdminActionRepository {
    private readonly repository;
    constructor(repository: Repository<AdminAction>);
    create(actionData: Partial<AdminAction>): Promise<AdminAction>;
    findByAdminId(adminId: string, page?: number, limit?: number): Promise<{
        actions: AdminAction[];
        total: number;
    }>;
    findByTargetUserId(targetUserId: string, page?: number, limit?: number): Promise<{
        actions: AdminAction[];
        total: number;
    }>;
    getRecentActions(days?: number): Promise<{
        actionType: string;
        count: string;
    }[]>;
}
