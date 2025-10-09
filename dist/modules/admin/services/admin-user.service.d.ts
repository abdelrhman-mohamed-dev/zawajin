import { I18nService } from 'nestjs-i18n';
import { UserRepository } from '../../auth/repositories/user.repository';
import { AdminActionRepository } from '../repositories/admin-action.repository';
import { ActivityLogRepository } from '../repositories/activity-log.repository';
import { AdminNotificationRepository } from '../repositories/admin-notification.repository';
import { MailService } from '../../mail/services/mail.service';
import { FirebaseService } from '../../../services/firebase.service';
import { UpdateUserAdminDto } from '../dto/update-user-admin.dto';
import { BanUserDto } from '../dto/ban-user.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';
export declare class AdminUserService {
    private readonly userRepository;
    private readonly adminActionRepository;
    private readonly activityLogRepository;
    private readonly adminNotificationRepository;
    private readonly mailService;
    private readonly firebaseService;
    private readonly i18n;
    constructor(userRepository: UserRepository, adminActionRepository: AdminActionRepository, activityLogRepository: ActivityLogRepository, adminNotificationRepository: AdminNotificationRepository, mailService: MailService, firebaseService: FirebaseService, i18n: I18nService);
    getAllUsers(page?: number, limit?: number, search?: string, role?: string, isBanned?: boolean, isVerified?: boolean): Promise<{
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
    getUserById(userId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../../auth/entities/user.entity").User;
    }>;
    updateUser(userId: string, updateData: UpdateUserAdminDto, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../../auth/entities/user.entity").User;
    }>;
    banUser(userId: string, banData: BanUserDto, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    unbanUser(userId: string, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteUser(userId: string, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyUser(userId: string, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendNotificationToUser(userId: string, notificationData: SendNotificationDto, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            status: string;
        };
    }>;
    getUserActivityLogs(userId: string, page?: number, limit?: number, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            logs: import("../entities/activity-log.entity").ActivityLog[];
            total: number;
        };
    }>;
}
