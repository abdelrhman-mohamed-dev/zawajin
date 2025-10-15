import { I18nContext } from 'nestjs-i18n';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetUsersDto } from '../dto/get-users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, updateProfileDto: UpdateProfileDto, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: import("../../auth/entities/user.entity").User;
        timestamp: string;
    }>;
    getLatestUsers(i18n: I18nContext, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: any[];
        timestamp: string;
    }>;
    getUserById(userId: string, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: any;
        timestamp: string;
    }>;
    getAllUsers(req: any, getUsersDto: GetUsersDto, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: {
            users: any[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
            };
        };
        timestamp: string;
    }>;
}
