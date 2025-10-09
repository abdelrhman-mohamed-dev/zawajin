import { I18nService } from 'nestjs-i18n';
import { UserReportRepository } from '../repositories/user-report.repository';
import { AdminActionRepository } from '../repositories/admin-action.repository';
import { CreateReportDto } from '../dto/create-report.dto';
import { ResolveReportDto } from '../dto/resolve-report.dto';
export declare class AdminReportService {
    private readonly userReportRepository;
    private readonly adminActionRepository;
    private readonly i18n;
    constructor(userReportRepository: UserReportRepository, adminActionRepository: AdminActionRepository, i18n: I18nService);
    getAllReports(page?: number, limit?: number, status?: string, priority?: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            reports: import("../entities/user-report.entity").UserReport[];
            total: number;
        };
    }>;
    getReportById(reportId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
    createReport(reportData: CreateReportDto, reporterId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
    reviewReport(reportId: string, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
    resolveReport(reportId: string, resolveData: ResolveReportDto, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
    dismissReport(reportId: string, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
}
