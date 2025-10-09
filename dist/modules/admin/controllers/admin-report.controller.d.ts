import { AdminReportService } from '../services/admin-report.service';
import { ResolveReportDto } from '../dto/resolve-report.dto';
export declare class AdminReportController {
    private readonly adminReportService;
    constructor(adminReportService: AdminReportService);
    getAllReports(page: number, limit: number, status?: string, priority?: string, req?: any): Promise<{
        success: boolean;
        message: string;
        data: {
            reports: import("../entities/user-report.entity").UserReport[];
            total: number;
        };
    }>;
    getReportById(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
    reviewReport(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
    resolveReport(id: string, resolveData: ResolveReportDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
    dismissReport(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/user-report.entity").UserReport;
    }>;
}
