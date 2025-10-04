import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/like.entity';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
  ) {}

  async create(userId: string, likedUserId: string): Promise<Like> {
    const like = this.likeRepo.create({ userId, likedUserId });
    return await this.likeRepo.save(like);
  }

  async findByUserAndLikedUser(userId: string, likedUserId: string): Promise<Like | null> {
    return await this.likeRepo.findOne({
      where: { userId, likedUserId },
    });
  }

  async delete(userId: string, likedUserId: string): Promise<void> {
    await this.likeRepo.delete({ userId, likedUserId });
  }

  async findLikesSentByUser(userId: string): Promise<Like[]> {
    return await this.likeRepo.find({
      where: { userId },
      relations: ['likedUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findLikesReceivedByUser(userId: string): Promise<Like[]> {
    return await this.likeRepo.find({
      where: { likedUserId: userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async checkMutualLike(userId: string, otherUserId: string): Promise<boolean> {
    const like1 = await this.findByUserAndLikedUser(userId, otherUserId);
    const like2 = await this.findByUserAndLikedUser(otherUserId, userId);
    return !!(like1 && like2);
  }

  async countLikesSent(userId: string): Promise<number> {
    return await this.likeRepo.count({ where: { userId } });
  }

  async countLikesReceived(userId: string): Promise<number> {
    return await this.likeRepo.count({ where: { likedUserId: userId } });
  }
}
