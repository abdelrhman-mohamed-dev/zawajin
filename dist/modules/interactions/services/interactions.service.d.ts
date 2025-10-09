import { LikeRepository } from '../repositories/like.repository';
import { BlockRepository } from '../repositories/block.repository';
import { UserRepository } from '../../auth/repositories/user.repository';
export declare class InteractionsService {
    private readonly likeRepository;
    private readonly blockRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(likeRepository: LikeRepository, blockRepository: BlockRepository, userRepository: UserRepository);
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
}
