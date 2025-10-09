import { AdminUserService } from '../services/admin-user.service';
import { UpdateUserAdminDto } from '../dto/update-user-admin.dto';
import { BanUserDto } from '../dto/ban-user.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';
export declare class AdminUserController {
    private readonly adminUserService;
    constructor(adminUserService: AdminUserService);
    getAllUsers(page: number, limit: number, search?: string, role?: string, isBanned?: boolean, isVerified?: boolean): Promise<{
        success: boolean;
        message: string;
        data: {
            users: import("../../auth/entities/user.entity").User[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../auth/entities/user.entity").User;
    }>;
    updateUser(id: string, updateData: UpdateUserAdminDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../auth/entities/user.entity").User;
    }>;
    banUser(id: string, banData: BanUserDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    unbanUser(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyUser(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    sendNotification(id: string, notificationData: SendNotificationDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            status: string;
        };
    }>;
    sendEmail(id: string, notificationData: SendNotificationDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            status: string;
        };
    }>;
    getUserActivityLogs(id: string, page: number, limit: number, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            logs: import("../entities/activity-log.entity").ActivityLog[];
            total: number;
        };
    }>;
}
