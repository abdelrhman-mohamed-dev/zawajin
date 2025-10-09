import { I18nContext } from 'nestjs-i18n';
import { InteractionsService } from '../services/interactions.service';
import { UsersService } from '../../users/services/users.service';
export declare class InteractionsController {
    private readonly interactionsService;
    private readonly usersService;
    constructor(interactionsService: InteractionsService, usersService: UsersService);
    likeUser(req: any, likedUserId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            isMatch: boolean;
        };
        timestamp: string;
    }>;
    unlikeUser(req: any, likedUserId: string, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    blockUser(req: any, blockedUserId: string, i18n: I18nContext, body?: {
        reason?: string;
    }): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    unblockUser(req: any, blockedUserId: string, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    getLikesSent(req: any, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: {
            likes: any[];
            total: number;
        };
        timestamp: string;
    }>;
    getLikesReceived(req: any, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: {
            likes: any[];
            total: number;
        };
        timestamp: string;
    }>;
    getBlockedUsers(req: any, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: {
            blocks: any[];
            total: number;
        };
        timestamp: string;
    }>;
    getUserById(id: string, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: any;
        timestamp: string;
    }>;
}
