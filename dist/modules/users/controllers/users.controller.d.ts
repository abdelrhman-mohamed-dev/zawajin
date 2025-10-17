import { I18nContext } from 'nestjs-i18n';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { SetUserStatusDto } from '../dto/set-user-status.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, updateProfileDto: UpdateProfileDto, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: import("../../auth/entities/user.entity").User;
        timestamp: string;
    }>;
    setUserStatus(req: any, setUserStatusDto: SetUserStatusDto, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: import("../../chat/entities/user-presence.entity").UserPresence;
        timestamp: string;
    }>;
    getLatestUsers(i18n: I18nContext, getUsersDto: GetUsersDto): Promise<{
        success: boolean;
        message: string;
        data: any[];
        timestamp: string;
    }>;
    getUserStatistics(i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: {
            totalMaleUsers: number;
            totalFemaleUsers: number;
            onlineMaleUsersToday: number;
            onlineFemaleUsersToday: number;
        };
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
