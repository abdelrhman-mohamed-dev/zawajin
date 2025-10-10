import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../auth/repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { User } from '../../auth/entities/user.entity';
import { Like } from '../../interactions/entities/like.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async updateProfile(userId: string, profileData: UpdateProfileDto): Promise<User> {
    this.logger.log(`Updating profile for user: ${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    // Prepare update data
    const updateData: Partial<User> = { ...profileData } as any;

    // Calculate age from dateOfBirth if provided
    if (profileData.dateOfBirth) {
      const birthDate = new Date(profileData.dateOfBirth);
      updateData.dateOfBirth = birthDate;

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      updateData.age = age;
    }

    const updatedUser = await this.userRepository.updateProfile(userId, updateData);

    this.logger.log(`Profile updated successfully for user: ${userId}`);

    // Remove sensitive data before returning
    delete updatedUser.passwordHash;

    return updatedUser;
  }

  async getAllUsers(queryDto: GetUsersDto, currentUserId?: string): Promise<{
    users: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.log(`Fetching users with filters: ${JSON.stringify(queryDto)}`);

    const result = await this.userRepository.findAllUsers(queryDto);

    // Get liked user IDs if currentUserId is provided
    const userIds = result.users.map(user => user.id);
    const likedUserIds = currentUserId
      ? await this.checkLikeStatus(currentUserId, userIds)
      : new Set<string>();

    // Remove sensitive data from all users and add hasLiked field
    const usersWithLikeStatus = result.users.map((user) => {
      const { passwordHash, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        hasLiked: likedUserIds.has(user.id),
      };
    });

    this.logger.log(`Retrieved ${usersWithLikeStatus.length} users out of ${result.total} total`);

    return {
      ...result,
      users: usersWithLikeStatus,
    };
  }

  async getUserById(userId: string, currentUserId?: string): Promise<any> {
    this.logger.log(`Fetching user by ID: ${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    if (!user.isActive) {
      throw new NotFoundException('User account is deactivated / حساب المستخدم معطل');
    }

    if (!user.isEmailVerified) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    // Get like relationship information
    let likedme = false;
    let isliked = false;
    let matching = false;

    if (currentUserId) {
      // Check if the target user liked the current user (likedme)
      const targetLikedCurrent = await this.likeRepository.findOne({
        where: { userId: userId, likedUserId: currentUserId },
      });
      likedme = !!targetLikedCurrent;

      // Check if current user liked the target user (isliked)
      const currentLikedTarget = await this.likeRepository.findOne({
        where: { userId: currentUserId, likedUserId: userId },
      });
      isliked = !!currentLikedTarget;

      // Both liked each other = matching
      matching = likedme && isliked;
    }

    // Remove sensitive data
    delete user.passwordHash;
    delete user.fcmToken;

    this.logger.log(`User retrieved successfully: ${userId}`);

    return {
      ...user,
      likedme,
      isliked,
      matching,
    };
  }

  async getCurrentUser(userId: string): Promise<User> {
    this.logger.log(`Fetching current user: ${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    // Remove sensitive data
    delete user.passwordHash;

    return user;
  }

  private async checkLikeStatus(currentUserId: string, targetUserIds: string[]): Promise<Set<string>> {
    if (!currentUserId || targetUserIds.length === 0) {
      return new Set();
    }

    const likes = await this.likeRepository.find({
      where: { userId: currentUserId },
      select: ['likedUserId'],
    });

    return new Set(likes.map(like => like.likedUserId));
  }
}
