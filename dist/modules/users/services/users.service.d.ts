import { Repository } from 'typeorm';
import { UserRepository } from '../../auth/repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { User } from '../../auth/entities/user.entity';
import { Like } from '../../interactions/entities/like.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly likeRepository;
    private readonly logger;
    constructor(userRepository: UserRepository, likeRepository: Repository<Like>);
    updateProfile(userId: string, profileData: UpdateProfileDto): Promise<User>;
    getAllUsers(queryDto: GetUsersDto, currentUserId?: string): Promise<{
        users: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(userId: string, currentUserId?: string): Promise<any>;
    getCurrentUser(userId: string): Promise<User>;
    private checkLikeStatus;
}
