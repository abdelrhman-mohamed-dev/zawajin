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
  origin?: string;
  religiousPractice?: string;
  sect?: string;
  prayerLevel?: string;
  profession?: string;
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
  bodyColor?: string;
  hairColor?: string;
  hairType?: string;
  eyeColor?: string;
  marriageType?: string;
  houseAvailable?: boolean;
  acceptPolygamy?: boolean;
  natureOfWork?: string;
  nationality?: string;
  placeOfResidence?: string;
  tribe?: string;
  numberOfChildren?: number;
  educationLevel?: string;
  financialStatus?: string;
  healthStatus?: string;
  religiosityLevel?: string;
  skinColor?: string;
  beauty?: string;
  polygamyStatus?: string;
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

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.userRepo.update(id, { passwordHash });
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

  async findAll(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: string,
    isBanned?: boolean,
    isVerified?: boolean,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .where('user.isDeleted = :isDeleted', { isDeleted: false });

    // Search by email, fullName, or chartNumber
    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.fullName ILIKE :search OR user.chartNumber ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Filter by role
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Filter by banned status
    if (isBanned !== undefined) {
      queryBuilder.andWhere('user.isBanned = :isBanned', { isBanned });
    }

    // Filter by verified status
    if (isVerified !== undefined) {
      queryBuilder.andWhere('user.isVerified = :isVerified', { isVerified });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination and select fields (exclude password hash)
    const users = await queryBuilder
      .select([
        'user.id',
        'user.fullName',
        'user.email',
        'user.phone',
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
        'user.role',
        'user.permissions',
        'user.isBanned',
        'user.banType',
        'user.bannedAt',
        'user.bannedUntil',
        'user.bannedReason',
        'user.isVerified',
        'user.verifiedAt',
        'user.isEmailVerified',
        'user.isPhoneVerified',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
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

  async findAllUsers(queryDto: GetUsersQueryDto): Promise<{
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

    // Basic filters
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

    // Location filters
    if (filters.city) {
      queryBuilder.andWhere("\"user\".\"location\" IS NOT NULL");
      queryBuilder.andWhere("\"user\".\"location\"::jsonb->>'city' = :city", {
        city: filters.city,
      });
    }

    if (filters.country) {
      queryBuilder.andWhere("\"user\".\"location\" IS NOT NULL");
      queryBuilder.andWhere("\"user\".\"location\"::jsonb->>'country' = :country", {
        country: filters.country,
      });
    }

    if (filters.origin) {
      queryBuilder.andWhere('user.origin = :origin', {
        origin: filters.origin,
      });
    }

    // Religious filters
    if (filters.religiousPractice) {
      queryBuilder.andWhere('user.religiousPractice = :religiousPractice', {
        religiousPractice: filters.religiousPractice,
      });
    }

    if (filters.sect) {
      queryBuilder.andWhere('user.sect = :sect', {
        sect: filters.sect,
      });
    }

    if (filters.prayerLevel) {
      queryBuilder.andWhere('user.prayerLevel = :prayerLevel', {
        prayerLevel: filters.prayerLevel,
      });
    }

    // Professional filters
    if (filters.profession) {
      queryBuilder.andWhere('user.profession = :profession', {
        profession: filters.profession,
      });
    }

    if (filters.natureOfWork) {
      queryBuilder.andWhere('user.natureOfWork = :natureOfWork', {
        natureOfWork: filters.natureOfWork,
      });
    }

    // Physical attributes filters
    if (filters.minHeight) {
      queryBuilder.andWhere('user.height >= :minHeight', {
        minHeight: filters.minHeight,
      });
    }

    if (filters.maxHeight) {
      queryBuilder.andWhere('user.height <= :maxHeight', {
        maxHeight: filters.maxHeight,
      });
    }

    if (filters.minWeight) {
      queryBuilder.andWhere('user.weight >= :minWeight', {
        minWeight: filters.minWeight,
      });
    }

    if (filters.maxWeight) {
      queryBuilder.andWhere('user.weight <= :maxWeight', {
        maxWeight: filters.maxWeight,
      });
    }

    if (filters.bodyColor) {
      queryBuilder.andWhere('user.bodyColor = :bodyColor', {
        bodyColor: filters.bodyColor,
      });
    }

    if (filters.hairColor) {
      queryBuilder.andWhere('user.hairColor = :hairColor', {
        hairColor: filters.hairColor,
      });
    }

    if (filters.hairType) {
      queryBuilder.andWhere('user.hairType = :hairType', {
        hairType: filters.hairType,
      });
    }

    if (filters.eyeColor) {
      queryBuilder.andWhere('user.eyeColor = :eyeColor', {
        eyeColor: filters.eyeColor,
      });
    }

    // Marriage preferences filters
    if (filters.marriageType) {
      queryBuilder.andWhere('user.marriageType = :marriageType', {
        marriageType: filters.marriageType,
      });
    }

    if (filters.houseAvailable !== undefined) {
      queryBuilder.andWhere('user.houseAvailable = :houseAvailable', {
        houseAvailable: filters.houseAvailable,
      });
    }

    if (filters.acceptPolygamy !== undefined) {
      queryBuilder.andWhere('user.acceptPolygamy = :acceptPolygamy', {
        acceptPolygamy: filters.acceptPolygamy,
      });
    }

    // New profile filters
    if (filters.nationality) {
      queryBuilder.andWhere('user.nationality = :nationality', {
        nationality: filters.nationality,
      });
    }

    if (filters.placeOfResidence) {
      queryBuilder.andWhere('user.placeOfResidence = :placeOfResidence', {
        placeOfResidence: filters.placeOfResidence,
      });
    }

    if (filters.tribe) {
      queryBuilder.andWhere('user.tribe = :tribe', {
        tribe: filters.tribe,
      });
    }

    if (filters.numberOfChildren !== undefined) {
      queryBuilder.andWhere('user.numberOfChildren = :numberOfChildren', {
        numberOfChildren: filters.numberOfChildren,
      });
    }

    if (filters.educationLevel) {
      queryBuilder.andWhere('user.educationLevel = :educationLevel', {
        educationLevel: filters.educationLevel,
      });
    }

    if (filters.financialStatus) {
      queryBuilder.andWhere('user.financialStatus = :financialStatus', {
        financialStatus: filters.financialStatus,
      });
    }

    if (filters.healthStatus) {
      queryBuilder.andWhere('user.healthStatus = :healthStatus', {
        healthStatus: filters.healthStatus,
      });
    }

    if (filters.religiosityLevel) {
      queryBuilder.andWhere('user.religiosityLevel = :religiosityLevel', {
        religiosityLevel: filters.religiosityLevel,
      });
    }

    if (filters.skinColor) {
      queryBuilder.andWhere('user.skinColor = :skinColor', {
        skinColor: filters.skinColor,
      });
    }

    if (filters.beauty) {
      queryBuilder.andWhere('user.beauty = :beauty', {
        beauty: filters.beauty,
      });
    }

    if (filters.polygamyStatus) {
      queryBuilder.andWhere('user.polygamyStatus = :polygamyStatus', {
        polygamyStatus: filters.polygamyStatus,
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
        'user.dateOfBirth',
        'user.location',
        'user.origin',
        'user.nationality',
        'user.placeOfResidence',
        'user.tribe',
        'user.numberOfChildren',
        'user.educationLevel',
        'user.financialStatus',
        'user.healthStatus',
        'user.religiosityLevel',
        'user.skinColor',
        'user.beauty',
        'user.polygamyStatus',
        'user.religiousPractice',
        'user.sect',
        'user.prayerLevel',
        'user.maritalStatus',
        'user.profession',
        'user.weight',
        'user.height',
        'user.bodyColor',
        'user.hairColor',
        'user.hairType',
        'user.eyeColor',
        'user.houseAvailable',
        'user.natureOfWork',
        'user.marriageType',
        'user.acceptPolygamy',
        'user.detailedProfile',
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

  async findLatestUsers(queryDto: GetUsersQueryDto): Promise<User[]> {
    const { limit = 10, ...filters } = queryDto;

    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified: true,
      });

    // Apply all filters from findAllUsers method
    // Basic filters
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

    // Location filters
    if (filters.city) {
      queryBuilder.andWhere("\"user\".\"location\" IS NOT NULL");
      queryBuilder.andWhere("\"user\".\"location\"::jsonb->>'city' = :city", {
        city: filters.city,
      });
    }

    if (filters.country) {
      queryBuilder.andWhere("\"user\".\"location\" IS NOT NULL");
      queryBuilder.andWhere("\"user\".\"location\"::jsonb->>'country' = :country", {
        country: filters.country,
      });
    }

    if (filters.origin) {
      queryBuilder.andWhere('user.origin = :origin', {
        origin: filters.origin,
      });
    }

    // New filters
    if (filters.nationality) {
      queryBuilder.andWhere('user.nationality = :nationality', {
        nationality: filters.nationality,
      });
    }

    if (filters.placeOfResidence) {
      queryBuilder.andWhere('user.placeOfResidence = :placeOfResidence', {
        placeOfResidence: filters.placeOfResidence,
      });
    }

    if (filters.tribe) {
      queryBuilder.andWhere('user.tribe = :tribe', {
        tribe: filters.tribe,
      });
    }

    if (filters.numberOfChildren !== undefined) {
      queryBuilder.andWhere('user.numberOfChildren = :numberOfChildren', {
        numberOfChildren: filters.numberOfChildren,
      });
    }

    if (filters.educationLevel) {
      queryBuilder.andWhere('user.educationLevel = :educationLevel', {
        educationLevel: filters.educationLevel,
      });
    }

    if (filters.financialStatus) {
      queryBuilder.andWhere('user.financialStatus = :financialStatus', {
        financialStatus: filters.financialStatus,
      });
    }

    if (filters.healthStatus) {
      queryBuilder.andWhere('user.healthStatus = :healthStatus', {
        healthStatus: filters.healthStatus,
      });
    }

    if (filters.religiosityLevel) {
      queryBuilder.andWhere('user.religiosityLevel = :religiosityLevel', {
        religiosityLevel: filters.religiosityLevel,
      });
    }

    if (filters.skinColor) {
      queryBuilder.andWhere('user.skinColor = :skinColor', {
        skinColor: filters.skinColor,
      });
    }

    if (filters.beauty) {
      queryBuilder.andWhere('user.beauty = :beauty', {
        beauty: filters.beauty,
      });
    }

    if (filters.polygamyStatus) {
      queryBuilder.andWhere('user.polygamyStatus = :polygamyStatus', {
        polygamyStatus: filters.polygamyStatus,
      });
    }

    // Religious filters
    if (filters.religiousPractice) {
      queryBuilder.andWhere('user.religiousPractice = :religiousPractice', {
        religiousPractice: filters.religiousPractice,
      });
    }

    if (filters.sect) {
      queryBuilder.andWhere('user.sect = :sect', {
        sect: filters.sect,
      });
    }

    if (filters.prayerLevel) {
      queryBuilder.andWhere('user.prayerLevel = :prayerLevel', {
        prayerLevel: filters.prayerLevel,
      });
    }

    // Professional filters
    if (filters.profession) {
      queryBuilder.andWhere('user.profession = :profession', {
        profession: filters.profession,
      });
    }

    if (filters.natureOfWork) {
      queryBuilder.andWhere('user.natureOfWork = :natureOfWork', {
        natureOfWork: filters.natureOfWork,
      });
    }

    // Physical attributes filters
    if (filters.minHeight) {
      queryBuilder.andWhere('user.height >= :minHeight', {
        minHeight: filters.minHeight,
      });
    }

    if (filters.maxHeight) {
      queryBuilder.andWhere('user.height <= :maxHeight', {
        maxHeight: filters.maxHeight,
      });
    }

    if (filters.minWeight) {
      queryBuilder.andWhere('user.weight >= :minWeight', {
        minWeight: filters.minWeight,
      });
    }

    if (filters.maxWeight) {
      queryBuilder.andWhere('user.weight <= :maxWeight', {
        maxWeight: filters.maxWeight,
      });
    }

    if (filters.bodyColor) {
      queryBuilder.andWhere('user.bodyColor = :bodyColor', {
        bodyColor: filters.bodyColor,
      });
    }

    if (filters.hairColor) {
      queryBuilder.andWhere('user.hairColor = :hairColor', {
        hairColor: filters.hairColor,
      });
    }

    if (filters.hairType) {
      queryBuilder.andWhere('user.hairType = :hairType', {
        hairType: filters.hairType,
      });
    }

    if (filters.eyeColor) {
      queryBuilder.andWhere('user.eyeColor = :eyeColor', {
        eyeColor: filters.eyeColor,
      });
    }

    // Marriage preferences filters
    if (filters.marriageType) {
      queryBuilder.andWhere('user.marriageType = :marriageType', {
        marriageType: filters.marriageType,
      });
    }

    if (filters.houseAvailable !== undefined) {
      queryBuilder.andWhere('user.houseAvailable = :houseAvailable', {
        houseAvailable: filters.houseAvailable,
      });
    }

    if (filters.acceptPolygamy !== undefined) {
      queryBuilder.andWhere('user.acceptPolygamy = :acceptPolygamy', {
        acceptPolygamy: filters.acceptPolygamy,
      });
    }

    return await queryBuilder
      .select([
        'user.id',
        'user.fullName',
        'user.email',
        'user.gender',
        'user.chartNumber',
        'user.bio',
        'user.age',
        'user.dateOfBirth',
        'user.location',
        'user.origin',
        'user.nationality',
        'user.placeOfResidence',
        'user.tribe',
        'user.numberOfChildren',
        'user.educationLevel',
        'user.financialStatus',
        'user.healthStatus',
        'user.religiosityLevel',
        'user.skinColor',
        'user.beauty',
        'user.polygamyStatus',
        'user.religiousPractice',
        'user.sect',
        'user.prayerLevel',
        'user.maritalStatus',
        'user.profession',
        'user.weight',
        'user.height',
        'user.bodyColor',
        'user.hairColor',
        'user.hairType',
        'user.eyeColor',
        'user.houseAvailable',
        'user.natureOfWork',
        'user.marriageType',
        'user.acceptPolygamy',
        'user.detailedProfile',
        'user.createdAt',
      ])
      .orderBy('user.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async getUserStatistics(): Promise<{
    totalMaleUsers: number;
    totalFemaleUsers: number;
    onlineMaleUsersToday: number;
    onlineFemaleUsersToday: number;
  }> {
    // Get total male users
    const totalMaleUsers = await this.userRepo.count({
      where: {
        gender: 'male',
        isActive: true,
        isEmailVerified: true,
      },
    });

    // Get total female users
    const totalFemaleUsers = await this.userRepo.count({
      where: {
        gender: 'female',
        isActive: true,
        isEmailVerified: true,
      },
    });

    // Get the start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Get online male users today (users with updatedAt >= today)
    const onlineMaleUsersToday = await this.userRepo
      .createQueryBuilder('user')
      .where('user.gender = :gender', { gender: 'male' })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('user.isEmailVerified = :isEmailVerified', { isEmailVerified: true })
      .andWhere('user.updatedAt >= :startOfToday', { startOfToday })
      .getCount();

    // Get online female users today
    const onlineFemaleUsersToday = await this.userRepo
      .createQueryBuilder('user')
      .where('user.gender = :gender', { gender: 'female' })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('user.isEmailVerified = :isEmailVerified', { isEmailVerified: true })
      .andWhere('user.updatedAt >= :startOfToday', { startOfToday })
      .getCount();

    return {
      totalMaleUsers,
      totalFemaleUsers,
      onlineMaleUsersToday,
      onlineFemaleUsersToday,
    };
  }
}