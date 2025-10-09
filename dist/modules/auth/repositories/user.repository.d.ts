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
export declare class UserRepository {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByChartNumber(chartNumber: string): Promise<User | null>;
    updateEmailVerified(id: string, isVerified: boolean): Promise<void>;
    updatePhoneVerified(id: string, isVerified: boolean): Promise<void>;
    updateFcmToken(id: string, fcmToken: string): Promise<void>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
    isEmailExists(email: string): Promise<boolean>;
    isPhoneExists(phone: string): Promise<boolean>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    updateProfile(userId: string, profileData: Partial<User>): Promise<User>;
    findAll(page?: number, limit?: number, search?: string, role?: string, isBanned?: boolean, isVerified?: boolean): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllUsers(queryDto: GetUsersQueryDto): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}
