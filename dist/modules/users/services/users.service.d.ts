import { Repository } from 'typeorm';
import { UserRepository } from '../../auth/repositories/user.repository';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { User } from '../../auth/entities/user.entity';
import { Like } from '../../interactions/entities/like.entity';
import { UserPresenceRepository } from '../../chat/repositories/user-presence.repository';
import { UserPresence } from '../../chat/entities/user-presence.entity';
import { ChatGateway } from '../../chat/gateways/chat.gateway';
export declare class UsersService {
    private readonly userRepository;
    private readonly likeRepository;
    private readonly userPresenceRepository;
    private readonly chatGateway;
    private readonly logger;
    constructor(userRepository: UserRepository, likeRepository: Repository<Like>, userPresenceRepository: UserPresenceRepository, chatGateway: ChatGateway);
    private sanitizeNumericFields;
    validateProfileByGender(userId: string, profileData: UpdateProfileDto): Promise<void>;
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
    getLatestUsers(queryDto: GetUsersDto): Promise<any[]>;
    getUserStatistics(): Promise<{
        totalMaleUsers: number;
        totalFemaleUsers: number;
        onlineMaleUsersToday: number;
        onlineFemaleUsersToday: number;
    }>;
    setUserStatus(userId: string, isOnline: boolean): Promise<UserPresence>;
}
