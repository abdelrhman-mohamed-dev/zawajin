import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from '../../auth/repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async updateProfile(userId: string, profileData: UpdateProfileDto): Promise<User> {
    this.logger.log(`Updating profile for user: ${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found / المستخدم غير موجود');
    }

    const updatedUser = await this.userRepository.updateProfile(userId, profileData);

    this.logger.log(`Profile updated successfully for user: ${userId}`);

    // Remove sensitive data before returning
    delete updatedUser.passwordHash;

    return updatedUser;
  }

  async getAllUsers(queryDto: GetUsersDto): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.log(`Fetching users with filters: ${JSON.stringify(queryDto)}`);

    const result = await this.userRepository.findAllUsers(queryDto);

    // Remove sensitive data from all users
    result.users = result.users.map((user) => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    });

    this.logger.log(`Retrieved ${result.users.length} users out of ${result.total} total`);

    return result;
  }

  async getUserById(userId: string): Promise<User> {
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

    // Remove sensitive data
    delete user.passwordHash;
    delete user.fcmToken;

    this.logger.log(`User retrieved successfully: ${userId}`);

    return user;
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
}
