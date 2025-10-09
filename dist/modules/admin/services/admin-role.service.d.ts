import { I18nService } from 'nestjs-i18n';
import { UserRepository } from '../../auth/repositories/user.repository';
import { AdminActionRepository } from '../repositories/admin-action.repository';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminRolesDto } from '../dto/update-admin-roles.dto';
export declare class AdminRoleService {
    private readonly userRepository;
    private readonly adminActionRepository;
    private readonly i18n;
    constructor(userRepository: UserRepository, adminActionRepository: AdminActionRepository, i18n: I18nService);
    getAllAdmins(page?: number, limit?: number, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            admins: import("../../auth/entities/user.entity").User[];
            total: number;
        };
    }>;
    createAdmin(adminData: CreateAdminDto, superAdminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../../auth/entities/user.entity").User;
    }>;
    updateAdminRoles(userId: string, rolesData: UpdateAdminRolesDto, superAdminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    promoteToSuperAdmin(userId: string, superAdminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    demoteToAdmin(userId: string, superAdminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeAdminPrivileges(userId: string, superAdminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
