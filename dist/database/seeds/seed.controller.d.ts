import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SubscriptionPlan } from '../../modules/subscriptions/entities/subscription-plan.entity';
import { User } from '../../modules/auth/entities/user.entity';
import { MatchingPreferences } from '../../modules/matching/entities/matching-preferences.entity';
import { Like } from '../../modules/interactions/entities/like.entity';
import { Conversation } from '../../modules/chat/entities/conversation.entity';
import { Message } from '../../modules/chat/entities/message.entity';
export declare class SeedController {
    private subscriptionPlanRepository;
    private userRepository;
    private matchingPreferencesRepository;
    private likeRepository;
    private conversationRepository;
    private messageRepository;
    private configService;
    private dataSource;
    constructor(subscriptionPlanRepository: Repository<SubscriptionPlan>, userRepository: Repository<User>, matchingPreferencesRepository: Repository<MatchingPreferences>, likeRepository: Repository<Like>, conversationRepository: Repository<Conversation>, messageRepository: Repository<Message>, configService: ConfigService, dataSource: DataSource);
    seedSubscriptionPlans(): Promise<{
        message: string;
        count: number;
        plans?: undefined;
    } | {
        message: string;
        count: number;
        plans: {
            id: string;
            name: string;
        }[];
    }>;
    seedSuperAdmin(): Promise<{
        message: string;
        email: string;
        warning?: undefined;
    } | {
        message: string;
        email: string;
        warning: string;
    }>;
    seedAll(): Promise<{
        success: boolean;
        message: string;
        results: {
            superAdmin: any;
            subscriptionPlans: any;
            users: any;
            matchingPreferences: any;
            likes: any;
            conversations: any;
        };
        note: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        results: {
            superAdmin: any;
            subscriptionPlans: any;
            users: any;
            matchingPreferences: any;
            likes: any;
            conversations: any;
        };
        note?: undefined;
    }>;
}
