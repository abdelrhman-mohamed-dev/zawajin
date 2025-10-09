import { Repository } from 'typeorm';
import { UserReport } from '../entities/user-report.entity';
export declare class UserReportRepository {
    private readonly repository;
    constructor(repository: Repository<UserReport>);
    create(reportData: Partial<UserReport>): Promise<UserReport>;
    findById(id: string): Promise<UserReport | null>;
    findAll(page?: number, limit?: number, status?: string, priority?: string): Promise<{
        reports: UserReport[];
        total: number;
    }>;
    findByReportedUser(userId: string): Promise<UserReport[]>;
    update(id: string, updateData: Partial<UserReport>): Promise<UserReport | null>;
}
