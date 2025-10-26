import { LikeRepository } from '../repositories/like.repository';
import { BlockRepository } from '../repositories/block.repository';
import { ProfileVisitRepository } from '../repositories/profile-visit.repository';
import { UserRepository } from '../../auth/repositories/user.repository';
import { ProfileVisitStatsDto } from '../dto/profile-visit-stats.dto';
import { VisitorDto } from '../dto/visitor.dto';
export declare class InteractionsService {
    private readonly likeRepository;
    private readonly blockRepository;
    private readonly profileVisitRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(likeRepository: LikeRepository, blockRepository: BlockRepository, profileVisitRepository: ProfileVisitRepository, userRepository: UserRepository);
    likeUser(userId: string, likedUserId: string): Promise<{
        message: string;
        isMatch: boolean;
    }>;
    unlikeUser(userId: string, likedUserId: string): Promise<void>;
    blockUser(userId: string, blockedUserId: string, reason?: string): Promise<void>;
    unblockUser(userId: string, blockedUserId: string): Promise<void>;
    getLikesSent(userId: string): Promise<any[]>;
    getLikesReceived(userId: string): Promise<any[]>;
    getBlockedUsers(userId: string): Promise<any[]>;
    recordProfileVisit(visitorId: string, profileOwnerId: string): Promise<void>;
    getProfileVisitStats(userId: string): Promise<ProfileVisitStatsDto>;
    getRecentVisitors(userId: string, limit?: number): Promise<VisitorDto[]>;
    markVisitAsSeen(userId: string, visitorId: string): Promise<void>;
    markAllVisitsAsSeen(userId: string): Promise<void>;
    getUnseenVisitsCount(userId: string): Promise<number>;
}
