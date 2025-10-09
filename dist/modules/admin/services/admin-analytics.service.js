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
const message_entity_1 = require("../../chat/entities/message.entity");
const like_entity_1 = require("../../interactions/entities/like.entity");
let AdminAnalyticsService = class AdminAnalyticsService {
    constructor(userRepository, subscriptionRepository, messageRepository, likeRepository, i18n) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
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
};
exports.AdminAnalyticsService = AdminAnalyticsService;
exports.AdminAnalyticsService = AdminAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(3, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        nestjs_i18n_1.I18nService])
], AdminAnalyticsService);
//# sourceMappingURL=admin-analytics.service.js.map