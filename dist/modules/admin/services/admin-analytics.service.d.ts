import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Subscription } from '../../subscriptions/entities/subscription.entity';
import { Message } from '../../chat/entities/message.entity';
import { Like } from '../../interactions/entities/like.entity';
export declare class AdminAnalyticsService {
    private readonly userRepository;
    private readonly subscriptionRepository;
    private readonly messageRepository;
    private readonly likeRepository;
    private readonly i18n;
    constructor(userRepository: Repository<User>, subscriptionRepository: Repository<Subscription>, messageRepository: Repository<Message>, likeRepository: Repository<Like>, i18n: I18nService);
    getOverview(lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            totalUsers: number;
            activeUsers: number;
            newUsersLast30Days: number;
            activeSubscriptions: number;
        };
    }>;
    getUserAnalytics(lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            dailyGrowth: any[];
            weeklyGrowth: any[];
            monthlyGrowth: any[];
            retention: {};
        };
    }>;
    getMatchAnalytics(lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            totalMatches: number;
            matchRate: number;
        };
    }>;
    getMessageAnalytics(lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            messagesLast30Days: number;
            activeConversations: number;
        };
    }>;
    getSubscriptionAnalytics(lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            revenue: number;
            conversions: number;
            churn: number;
        };
    }>;
}
