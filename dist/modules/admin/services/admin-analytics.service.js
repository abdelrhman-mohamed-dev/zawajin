"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
const subscription_plan_entity_1 = require("../../subscriptions/entities/subscription-plan.entity");
const message_entity_1 = require("../../chat/entities/message.entity");
const like_entity_1 = require("../../interactions/entities/like.entity");
const country_mapping_util_1 = require("../utils/country-mapping.util");
let AdminAnalyticsService = class AdminAnalyticsService {
    constructor(userRepository, subscriptionRepository, subscriptionPlanRepository, messageRepository, likeRepository, i18n) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.messageRepository = messageRepository;
        this.likeRepository = likeRepository;
        this.i18n = i18n;
    }
    async getOverview(lang = 'en') {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [totalUsers, activeUsers, newUsersLast30Days, activeSubscriptions] = await Promise.all([
            this.userRepository.count({ where: { isDeleted: false } }),
            this.userRepository.count({ where: { isDeleted: false, isActive: true } }),
            this.userRepository.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(last30Days) } }),
            this.subscriptionRepository.count({ where: { status: subscription_entity_1.SubscriptionStatus.ACTIVE } }),
        ]);
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
            data: {
                totalUsers,
                activeUsers,
                newUsersLast30Days,
                activeSubscriptions,
            },
        };
    }
    async getUserAnalytics(lang = 'en') {
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
            data: {
                dailyGrowth: [],
                weeklyGrowth: [],
                monthlyGrowth: [],
                retention: {},
            },
        };
    }
    async getMatchAnalytics(lang = 'en') {
        const totalMatches = await this.likeRepository
            .createQueryBuilder('like')
            .innerJoin('likes', 'l2', 'like.likedUserId = l2.userId AND like.userId = l2.likedUserId')
            .getCount();
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
            data: {
                totalMatches,
                matchRate: 0,
            },
        };
    }
    async getMessageAnalytics(lang = 'en') {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const messagesLast30Days = await this.messageRepository.count({
            where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(last30Days) },
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
            data: {
                messagesLast30Days,
                activeConversations: 0,
            },
        };
    }
    async getSubscriptionAnalytics(lang = 'en') {
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
            data: {
                revenue: 0,
                conversions: 0,
                churn: 0,
            },
        };
    }
    async getVisitorsByCountry(region, period, lang = 'en') {
        const now = new Date();
        let startDate = new Date(0);
        if (period === 'week') {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
        else if (period === 'month') {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        else if (period === 'year') {
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        }
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .select("user.location->>'country'", 'country')
            .addSelect("user.location->>'city'", 'city')
            .addSelect('COUNT(*)', 'count')
            .where('user.isDeleted = :isDeleted', { isDeleted: false })
            .andWhere("user.location->>'country' IS NOT NULL");
        if (period && period !== 'all') {
            queryBuilder.andWhere('user.createdAt >= :startDate', { startDate });
        }
        queryBuilder
            .groupBy("user.location->>'country'")
            .addGroupBy("user.location->>'city'")
            .orderBy('count', 'DESC');
        const results = await queryBuilder.getRawMany();
        const countryMap = new Map();
        results.forEach(row => {
            const country = row.country;
            const city = row.city || 'Unknown';
            const count = parseInt(row.count);
            if (!countryMap.has(country)) {
                countryMap.set(country, { count: 0, cities: new Map() });
            }
            const countryData = countryMap.get(country);
            countryData.count += count;
            countryData.cities.set(city, count);
        });
        let filteredCountries = Array.from(countryMap.entries());
        if (region && region !== 'all') {
            filteredCountries = filteredCountries.filter(([countryName]) => {
                const info = (0, country_mapping_util_1.getCountryInfo)(countryName);
                return info.region === region;
            });
        }
        const maxCount = Math.max(...filteredCountries.map(([_, data]) => data.count), 1);
        const countries = filteredCountries.map(([countryName, data]) => {
            const countryInfo = (0, country_mapping_util_1.getCountryInfo)(countryName);
            const citiesArray = Array.from(data.cities.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            const cities = citiesArray.map(([cityName, cityCount]) => ({
                name: cityName,
                users: (0, country_mapping_util_1.formatUserCount)(cityCount),
            }));
            return {
                name: countryName,
                users: (0, country_mapping_util_1.formatUserCount)(data.count),
                coordinates: countryInfo.coordinates,
                color: (0, country_mapping_util_1.getCountryColor)(data.count, maxCount),
                flag: countryInfo.flag,
                cities,
            };
        });
        countries.sort((a, b) => {
            const aCount = parseInt(a.users.replace(/[^0-9]/g, ''));
            const bCount = parseInt(b.users.replace(/[^0-9]/g, ''));
            return bCount - aCount;
        });
        return {
            success: true,
            data: {
                countries,
            },
        };
    }
    async getTopCountries(lang = 'en') {
        const now = new Date();
        const currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        const previousPeriodEnd = currentPeriodStart;
        const currentUsers = await this.userRepository
            .createQueryBuilder('user')
            .select("user.location->>'country'", 'country')
            .addSelect('COUNT(*)', 'count')
            .where('user.isDeleted = :isDeleted', { isDeleted: false })
            .andWhere("user.location->>'country' IS NOT NULL")
            .groupBy("user.location->>'country'")
            .getRawMany();
        const previousUsers = await this.userRepository
            .createQueryBuilder('user')
            .select("user.location->>'country'", 'country')
            .addSelect('COUNT(*)', 'count')
            .where('user.isDeleted = :isDeleted', { isDeleted: false })
            .andWhere('user.createdAt >= :start', { start: previousPeriodStart })
            .andWhere('user.createdAt < :end', { end: previousPeriodEnd })
            .andWhere("user.location->>'country' IS NOT NULL")
            .groupBy("user.location->>'country'")
            .getRawMany();
        const previousCountMap = new Map(previousUsers.map(row => [row.country, parseInt(row.count)]));
        const revenueByCountry = await this.subscriptionRepository
            .createQueryBuilder('sub')
            .leftJoin('sub.user', 'user')
            .leftJoin('sub.plan', 'plan')
            .select("user.location->>'country'", 'country')
            .addSelect('SUM(plan.price)', 'revenue')
            .where('sub.status = :status', { status: subscription_entity_1.SubscriptionStatus.ACTIVE })
            .andWhere("user.location->>'country' IS NOT NULL")
            .groupBy("user.location->>'country'")
            .getRawMany();
        const revenueMap = new Map(revenueByCountry.map(row => [row.country, parseFloat(row.revenue) || 0]));
        const totalUsers = currentUsers.reduce((sum, row) => sum + parseInt(row.count), 0);
        const totalRevenue = Array.from(revenueMap.values()).reduce((sum, val) => sum + val, 0);
        const countries = currentUsers.map((row, index) => {
            const countryName = row.country;
            const currentCount = parseInt(row.count);
            const previousCount = previousCountMap.get(countryName) || 0;
            let growth = 0;
            if (previousCount > 0) {
                growth = ((currentCount - previousCount) / previousCount) * 100;
            }
            else if (currentCount > 0) {
                growth = 100;
            }
            const countryInfo = (0, country_mapping_util_1.getCountryInfo)(countryName);
            return {
                rank: index + 1,
                country: countryName,
                flag: countryInfo.flag,
                users: currentCount,
                percentage: totalUsers > 0 ? (currentCount / totalUsers) * 100 : 0,
                growth: Math.round(growth * 10) / 10,
                revenue: revenueMap.get(countryName) || 0,
            };
        });
        countries.sort((a, b) => b.users - a.users);
        countries.forEach((country, index) => {
            country.rank = index + 1;
        });
        return {
            success: true,
            data: {
                countries,
                totalUsers,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
            },
        };
    }
};
exports.AdminAnalyticsService = AdminAnalyticsService;
exports.AdminAnalyticsService = AdminAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_plan_entity_1.SubscriptionPlan)),
    __param(3, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(4, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        nestjs_i18n_1.I18nService])
], AdminAnalyticsService);
//# sourceMappingURL=admin-analytics.service.js.map