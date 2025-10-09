import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';
export declare class LikeRepository {
    private readonly likeRepo;
    constructor(likeRepo: Repository<Like>);
    create(userId: string, likedUserId: string): Promise<Like>;
    findByUserAndLikedUser(userId: string, likedUserId: string): Promise<Like | null>;
    delete(userId: string, likedUserId: string): Promise<void>;
    findLikesSentByUser(userId: string): Promise<Like[]>;
    findLikesReceivedByUser(userId: string): Promise<Like[]>;
    checkMutualLike(userId: string, otherUserId: string): Promise<boolean>;
    countLikesSent(userId: string): Promise<number>;
    countLikesReceived(userId: string): Promise<number>;
}
