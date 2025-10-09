import { AdminRoleService } from '../services/admin-role.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminRolesDto } from '../dto/update-admin-roles.dto';
export declare class AdminRoleController {
    private readonly adminRoleService;
    constructor(adminRoleService: AdminRoleService);
    getAllAdmins(page: number, limit: number, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            admins: import("../../auth/entities/user.entity").User[];
            total: number;
        };
    }>;
    createAdmin(adminData: CreateAdminDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../auth/entities/user.entity").User;
    }>;
    updateAdminRoles(id: string, rolesData: UpdateAdminRolesDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    promoteToSuperAdmin(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    demoteToAdmin(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    removeAdminPrivileges(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
