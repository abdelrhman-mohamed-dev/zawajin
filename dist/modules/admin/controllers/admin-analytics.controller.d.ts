import { AdminAnalyticsService } from '../services/admin-analytics.service';
export declare class AdminAnalyticsController {
    private readonly adminAnalyticsService;
    constructor(adminAnalyticsService: AdminAnalyticsService);
    getOverview(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            totalUsers: number;
            activeUsers: number;
            newUsersLast30Days: number;
            activeSubscriptions: number;
        };
    }>;
    getUserAnalytics(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            dailyGrowth: any[];
            weeklyGrowth: any[];
            monthlyGrowth: any[];
            retention: {};
        };
    }>;
    getMatchAnalytics(any: any): Promise<{
        success: boolean;
        message: string;
        data: {
            totalMatches: number;
            matchRate: number;
        };
    }>;
    getMessageAnalytics(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            messagesLast30Days: number;
            activeConversations: number;
        };
    }>;
    getSubscriptionAnalytics(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            revenue: number;
            conversions: number;
            churn: number;
        };
    }>;
    getVisitorsByCountry(region?: string, period?: string, req?: any): Promise<{
        success: boolean;
        data: {
            countries: import("../dto/country-analytics.dto").CountryData[];
        };
    }>;
    getTopCountries(req: any): Promise<{
        success: boolean;
        data: {
            countries: import("../dto/country-analytics.dto").CountryStats[];
            totalUsers: any;
            totalRevenue: number;
        };
    }>;
}
