import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../auth/repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { User } from '../../auth/entities/user.entity';
import { Like } from '../../interactions/entities/like.entity';
import { UserPresenceRepository } from '../../chat/repositories/user-presence.repository';
import { UserPresence } from '../../chat/entities/user-presence.entity';
import { ChatGateway } from '../../chat/gateways/chat.gateway';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly userPresenceRepository: UserPresenceRepository,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  /**
   * Converts numeric fields to integers to remove .00 decimals
   */
  private sanitizeNumericFields(user: any): any {
    const numericFields = [
      'age', 'numberOfChildren', 'weight', 'height',
      'preferredAgeFrom', 'preferredAgeTo',
      'preferredMinWeight', 'preferredMaxWeight',
      'preferredMinHeight', 'preferredMaxHeight'
    ];

    const sanitized = { ...user };

    numericFields.forEach(field => {
      if (sanitized[field] !== null && sanitized[field] !== undefined) {
        sanitized[field] = Math.round(Number(sanitized[field]));
      }
    });

    return sanitized;
  }

  async validateProfileByGender(userId: string, profileData: UpdateProfileDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    const gender = user.gender.toLowerCase();

    // Define gender-specific enum values
    const maleMaritalStatuses = ['single', 'divorced', 'widowed', 'married'];
    const femaleMaritalStatuses = [
      'virgin',
      'f_divorced',
      'f_widowed',
    ];

    const maleHealthStatuses = ['healthy', 'chronically_ill', 'disabled'];
    const femaleHealthStatuses = [
      'f_healthy',
      'f_chronically_ill',
      'f_disabled',
    ];

    const maleReligiosityLevels = ['normal', 'conservative', 'committed'];
    const femaleReligiosityLevels = [
      'f_normal',
      'f_conservative',
      'f_committed',
    ];

    const maleEmploymentTypes = ['unemployed', 'employed', 'self_employed'];
    const femaleEmploymentTypes = [
      'f_unemployed',
      'f_employed',
      'self_employed',
    ];

    const maleBeautyValues = ['acceptable', 'average', 'handsome'];
    const femaleBeautyValues = [
      'f_acceptable',
      'f_average',
      'f_beautiful',
      'f_very_beautiful',
      'beautiful',
      'very_beautiful',
    ];

    // Validation for males
    if (gender === 'male') {
      // Males should NOT have acceptPolygamy field
      if (profileData.acceptPolygamy !== undefined && profileData.acceptPolygamy !== null) {
        throw new BadRequestException(
          'Male users cannot have acceptPolygamy field. Use polygamyStatus instead.',
        );
      }

      // Validate marital status for males
      if (
        profileData.maritalStatus &&
        !maleMaritalStatuses.includes(profileData.maritalStatus)
      ) {
        throw new BadRequestException(
          `Invalid marital status for male users. Must be one of: ${maleMaritalStatuses.join(', ')}`,
        );
      }

      // Validate health status for males
      if (
        profileData.healthStatus &&
        !maleHealthStatuses.includes(profileData.healthStatus as string)
      ) {
        throw new BadRequestException(
          `Invalid health status for male users. Must be one of: ${maleHealthStatuses.join(', ')}`,
        );
      }

      // Validate religiosity level for males
      if (
        profileData.religiosityLevel &&
        !maleReligiosityLevels.includes(profileData.religiosityLevel as string)
      ) {
        throw new BadRequestException(
          `Invalid religiosity level for male users. Must be one of: ${maleReligiosityLevels.join(', ')}`,
        );
      }

      // Validate employment type for males
      if (
        profileData.natureOfWork &&
        !maleEmploymentTypes.includes(profileData.natureOfWork as string)
      ) {
        throw new BadRequestException(
          `Invalid employment type for male users. Must be one of: ${maleEmploymentTypes.join(', ')}`,
        );
      }

      // Validate beauty for males
      if (profileData.beauty && !maleBeautyValues.includes(profileData.beauty as string)) {
        throw new BadRequestException(
          `Invalid beauty value for male users. Must be one of: ${maleBeautyValues.join(', ')}`,
        );
      }
    }

    // Validation for females
    if (gender === 'female') {
      // Females should NOT have polygamyStatus field (string enum)
      // They can only have acceptPolygamy (boolean)
      if (
        profileData.polygamyStatus !== undefined &&
        profileData.polygamyStatus !== null &&
        typeof profileData.polygamyStatus === 'string'
      ) {
        throw new BadRequestException(
          'Female users cannot have polygamyStatus field. Use acceptPolygamy (boolean) instead.',
        );
      }

      // Validate marital status for females
      if (
        profileData.maritalStatus &&
        !femaleMaritalStatuses.includes(profileData.maritalStatus)
      ) {
        throw new BadRequestException(
          `Invalid marital status for female users. Must be one of: ${femaleMaritalStatuses.join(', ')}`,
        );
      }

      // Validate health status for females
      if (
        profileData.healthStatus &&
        !femaleHealthStatuses.includes(profileData.healthStatus as string)
      ) {
        throw new BadRequestException(
          `Invalid health status for female users. Must be one of: ${femaleHealthStatuses.join(', ')}`,
        );
      }

      // Validate religiosity level for females
      if (
        profileData.religiosityLevel &&
        !femaleReligiosityLevels.includes(profileData.religiosityLevel as string)
      ) {
        throw new BadRequestException(
          `Invalid religiosity level for female users. Must be one of: ${femaleReligiosityLevels.join(', ')}`,
        );
      }

      // Validate employment type for females
      if (
        profileData.natureOfWork &&
        !femaleEmploymentTypes.includes(profileData.natureOfWork as string)
      ) {
        throw new BadRequestException(
          `Invalid employment type for female users. Must be one of: ${femaleEmploymentTypes.join(', ')}`,
        );
      }

      // Validate beauty for females
      if (
        profileData.beauty &&
        !femaleBeautyValues.includes(profileData.beauty as string)
      ) {
        throw new BadRequestException(
          `Invalid beauty value for female users. Must be one of: ${femaleBeautyValues.join(', ')}`,
        );
      }
    }
  }

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

    return this.sanitizeNumericFields(updatedUser);
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

    // Get online status for all users
    const presencePromises = userIds.map(id => this.userPresenceRepository.getUserPresence(id));
    const presences = await Promise.all(presencePromises);
    const presenceMap = new Map(
      presences.map((presence, index) => [
        userIds[index],
        { isOnline: presence ? presence.isOnline : true, lastSeenAt: presence ? presence.lastSeenAt : null }
      ])
    );

    // Remove sensitive data from all users and add hasLiked field and online status
    const usersWithLikeStatus = result.users.map((user) => {
      const { passwordHash, ...userWithoutPassword } = user;
      const presenceData = presenceMap.get(user.id);
      return this.sanitizeNumericFields({
        ...userWithoutPassword,
        hasLiked: likedUserIds.has(user.id),
        isOnline: presenceData?.isOnline ?? true,
        lastSeenAt: presenceData?.lastSeenAt ?? null,
      });
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

    // Get online status from user presence
    const presence = await this.userPresenceRepository.getUserPresence(userId);
    const isOnline = presence ? presence.isOnline : true; // Default to true if no presence record
    const lastSeenAt = presence ? presence.lastSeenAt : null;

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

    return this.sanitizeNumericFields({
      ...user,
      isOnline,
      lastSeenAt,
      likedme,
      isliked,
      matching,
    });
  }

  async getCurrentUser(userId: string): Promise<User> {
    this.logger.log(`Fetching current user: ${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    // Remove sensitive data
    delete user.passwordHash;

    return this.sanitizeNumericFields(user);
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

  async getLatestUsers(queryDto: GetUsersDto): Promise<any[]> {
    const limit = queryDto.limit || 10;
    this.logger.log(`Fetching latest ${limit} joined users with filters: ${JSON.stringify(queryDto)}`);

    const users = await this.userRepository.findLatestUsers(queryDto);

    // Get online status for all users
    const userIds = users.map(user => user.id);
    const presencePromises = userIds.map(id => this.userPresenceRepository.getUserPresence(id));
    const presences = await Promise.all(presencePromises);
    const presenceMap = new Map(
      presences.map((presence, index) => [
        userIds[index],
        { isOnline: presence ? presence.isOnline : true, lastSeenAt: presence ? presence.lastSeenAt : null }
      ])
    );

    // Remove sensitive data from all users and add online status
    const sanitizedUsers = users.map((user) => {
      const { passwordHash, fcmToken, ...userWithoutSensitiveData } = user;
      const presenceData = presenceMap.get(user.id);
      return this.sanitizeNumericFields({
        ...userWithoutSensitiveData,
        isOnline: presenceData?.isOnline ?? true,
        lastSeenAt: presenceData?.lastSeenAt ?? null,
      });
    });

    this.logger.log(`Retrieved ${sanitizedUsers.length} latest users`);

    return sanitizedUsers;
  }

  async getUserStatistics(): Promise<{
    totalMaleUsers: number;
    totalFemaleUsers: number;
    onlineMaleUsersToday: number;
    onlineFemaleUsersToday: number;
  }> {
    this.logger.log('Fetching user statistics');

    const stats = await this.userRepository.getUserStatistics();

    this.logger.log(`Statistics retrieved: ${JSON.stringify(stats)}`);

    return stats;
  }

  async setUserStatus(userId: string, isOnline: boolean): Promise<UserPresence> {
    this.logger.log(`Setting user status for user ${userId} to ${isOnline ? 'online' : 'offline'}`);

    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    const presence = await this.userPresenceRepository.setUserStatus(userId, isOnline);

    // Broadcast status change to all connected clients via socket
    this.chatGateway.broadcastUserStatusChange(userId, isOnline);

    this.logger.log(`User status updated successfully for user: ${userId} and broadcasted`);

    return presence;
  }
}
