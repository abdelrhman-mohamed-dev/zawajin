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
    recordProfileVisit(req: any, profileOwnerId: string): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    getProfileVisitStats(req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../dto/profile-visit-stats.dto").ProfileVisitStatsDto;
        timestamp: string;
    }>;
    getRecentVisitors(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            visitors: import("../dto/visitor.dto").VisitorDto[];
            total: number;
            unseenVisits: number;
        };
        timestamp: string;
    }>;
    markVisitAsSeen(req: any, visitorId: string): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    markAllVisitsAsSeen(req: any): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    getUnseenVisitsCount(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            unseenVisits: number;
        };
        timestamp: string;
    }>;
}
