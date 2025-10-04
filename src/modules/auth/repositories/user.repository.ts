import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface GetUsersQueryDto {
  page?: number;
  limit?: number;
  gender?: string;
  maritalStatus?: string;
  minAge?: number;
  maxAge?: number;
  city?: string;
  country?: string;
  religiousPractice?: string;
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return await this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { phone } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByChartNumber(chartNumber: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { chartNumber } });
  }

  async updateEmailVerified(id: string, isVerified: boolean): Promise<void> {
    await this.userRepo.update(id, { isEmailVerified: isVerified });
  }

  async updatePhoneVerified(id: string, isVerified: boolean): Promise<void> {
    await this.userRepo.update(id, { isPhoneVerified: isVerified });
  }

  async updateFcmToken(id: string, fcmToken: string): Promise<void> {
    await this.userRepo.update(id, { fcmToken });
  }

  async isEmailExists(email: string): Promise<boolean> {
    const count = await this.userRepo.count({ where: { email } });
    return count > 0;
  }

  async isPhoneExists(phone: string): Promise<boolean> {
    const count = await this.userRepo.count({ where: { phone } });
    return count > 0;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepo.update(id, updateData);
    return this.findById(id);
  }

  async updateProfile(userId: string, profileData: Partial<User>): Promise<User> {
    await this.userRepo.update(userId, profileData);
    return this.findById(userId);
  }

  async findAll(queryDto: GetUsersQueryDto): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified: true,
      });

    // Apply filters
    if (filters.gender) {
      queryBuilder.andWhere('user.gender = :gender', {
        gender: filters.gender,
      });
    }

    if (filters.maritalStatus) {
      queryBuilder.andWhere('user.maritalStatus = :maritalStatus', {
        maritalStatus: filters.maritalStatus,
      });
    }

    if (filters.minAge) {
      queryBuilder.andWhere('user.age >= :minAge', { minAge: filters.minAge });
    }

    if (filters.maxAge) {
      queryBuilder.andWhere('user.age <= :maxAge', { maxAge: filters.maxAge });
    }

    if (filters.city) {
      queryBuilder.andWhere("user.location->>'city' = :city", {
        city: filters.city,
      });
    }

    if (filters.country) {
      queryBuilder.andWhere("user.location->>'country' = :country", {
        country: filters.country,
      });
    }

    if (filters.religiousPractice) {
      queryBuilder.andWhere('user.religiousPractice = :religiousPractice', {
        religiousPractice: filters.religiousPractice,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and select fields (exclude password hash)
    const users = await queryBuilder
      .select([
        'user.id',
        'user.fullName',
        'user.email',
        'user.gender',
        'user.chartNumber',
        'user.bio',
        'user.age',
        'user.location',
        'user.religiousPractice',
        'user.sect',
        'user.prayerLevel',
        'user.maritalStatus',
        'user.profession',
        'user.createdAt',
      ])
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async save(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}