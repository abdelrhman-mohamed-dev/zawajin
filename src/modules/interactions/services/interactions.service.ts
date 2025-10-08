import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { BlockRepository } from '../repositories/block.repository';
import { UserRepository } from '../../auth/repositories/user.repository';

@Injectable()
export class InteractionsService {
  private readonly logger = new Logger(InteractionsService.name);

  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly blockRepository: BlockRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async likeUser(userId: string, likedUserId: string): Promise<{
    message: string;
    isMatch: boolean;
  }> {
    this.logger.log(`User ${userId} attempting to like user ${likedUserId}`);

    // Validate: Cannot like yourself
    if (userId === likedUserId) {
      throw new BadRequestException('You cannot like yourself / لا يمكنك الإعجاب بنفسك');
    }

    // Check if target user exists
    const targetUser = await this.userRepository.findById(likedUserId);
    if (!targetUser || !targetUser.isActive || !targetUser.isEmailVerified) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    // Check if either user has blocked the other
    const isBlocked = await this.blockRepository.isBlockedByEither(userId, likedUserId);
    if (isBlocked) {
      throw new BadRequestException('Cannot like this user / لا يمكن الإعجاب بهذا المستخدم');
    }

    // Check if already liked
    const existingLike = await this.likeRepository.findByUserAndLikedUser(userId, likedUserId);
    if (existingLike) {
      throw new ConflictException('You already liked this user / لقد أعجبت بهذا المستخدم بالفعل');
    }

    // Create the like
    await this.likeRepository.create(userId, likedUserId);

    // Check for mutual like (match)
    const isMatch = await this.likeRepository.checkMutualLike(userId, likedUserId);

    this.logger.log(`User ${userId} liked user ${likedUserId}. Match: ${isMatch}`);

    return {
      message: isMatch
        ? 'It\'s a match! / إنه تطابق!'
        : 'Like sent successfully / تم إرسال الإعجاب بنجاح',
      isMatch,
    };
  }

  async unlikeUser(userId: string, likedUserId: string): Promise<void> {
    this.logger.log(`User ${userId} attempting to unlike user ${likedUserId}`);

    const existingLike = await this.likeRepository.findByUserAndLikedUser(userId, likedUserId);
    if (!existingLike) {
      throw new NotFoundException('Like not found / الإعجاب غير موجود');
    }

    await this.likeRepository.delete(userId, likedUserId);
    this.logger.log(`User ${userId} unliked user ${likedUserId}`);
  }

  async blockUser(userId: string, blockedUserId: string, reason?: string): Promise<void> {
    this.logger.log(`User ${userId} attempting to block user ${blockedUserId}`);

    // Validate: Cannot block yourself
    if (userId === blockedUserId) {
      throw new BadRequestException('You cannot block yourself / لا يمكنك حظر نفسك');
    }

    // Check if target user exists
    const targetUser = await this.userRepository.findById(blockedUserId);
    if (!targetUser) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    // Check if already blocked
    const existingBlock = await this.blockRepository.findByBlockerAndBlocked(userId, blockedUserId);
    if (existingBlock) {
      throw new ConflictException('You already blocked this user / لقد قمت بحظر هذا المستخدم بالفعل');
    }

    // Create the block
    await this.blockRepository.create(userId, blockedUserId, reason);

    // Delete any existing likes between these users
    await this.likeRepository.delete(userId, blockedUserId);
    await this.likeRepository.delete(blockedUserId, userId);

    this.logger.log(`User ${userId} blocked user ${blockedUserId}`);
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<void> {
    this.logger.log(`User ${userId} attempting to unblock user ${blockedUserId}`);

    const existingBlock = await this.blockRepository.findByBlockerAndBlocked(userId, blockedUserId);
    if (!existingBlock) {
      throw new NotFoundException('Block not found / الحظر غير موجود');
    }

    await this.blockRepository.delete(userId, blockedUserId);
    this.logger.log(`User ${userId} unblocked user ${blockedUserId}`);
  }

  async getLikesSent(userId: string): Promise<any[]> {
    this.logger.log(`Getting likes sent by user ${userId}`);
    const likes = await this.likeRepository.findLikesSentByUser(userId);

    return likes.map((like) => {
      const { passwordHash, fcmToken, ...userData } = like.likedUser;
      return {
        id: like.id,
        likedUser: userData,
        createdAt: like.createdAt,
      };
    });
  }

  async getLikesReceived(userId: string): Promise<any[]> {
    this.logger.log(`Getting likes received by user ${userId}`);
    const likes = await this.likeRepository.findLikesReceivedByUser(userId);

    return likes.map((like) => {
      const { passwordHash, fcmToken, ...userData } = like.user;
      return {
        id: like.id,
        user: userData,
        createdAt: like.createdAt,
      };
    });
  }

  async getBlockedUsers(userId: string): Promise<any[]> {
    this.logger.log(`Getting blocked users for user ${userId}`);
    const blocks = await this.blockRepository.findBlocksByUser(userId);

    return blocks.map((block) => ({
      id: block.id,
      blockedUser: {
        id: block.blocked.id,
        fullName: block.blocked.fullName,
        chartNumber: block.blocked.chartNumber,
      },
      reason: block.reason,
      createdAt: block.createdAt,
    }));
  }
}
