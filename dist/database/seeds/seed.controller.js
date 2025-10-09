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
exports.SeedController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const subscription_plan_entity_1 = require("../../modules/subscriptions/entities/subscription-plan.entity");
const user_entity_1 = require("../../modules/auth/entities/user.entity");
const matching_preferences_entity_1 = require("../../modules/matching/entities/matching-preferences.entity");
const like_entity_1 = require("../../modules/interactions/entities/like.entity");
const conversation_entity_1 = require("../../modules/chat/entities/conversation.entity");
const message_entity_1 = require("../../modules/chat/entities/message.entity");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const users_seed_1 = require("./users.seed");
const matching_preferences_seed_1 = require("./matching-preferences.seed");
const likes_seed_1 = require("./likes.seed");
const conversations_seed_1 = require("./conversations.seed");
let SeedController = class SeedController {
    constructor(subscriptionPlanRepository, userRepository, matchingPreferencesRepository, likeRepository, conversationRepository, messageRepository, configService, dataSource) {
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.userRepository = userRepository;
        this.matchingPreferencesRepository = matchingPreferencesRepository;
        this.likeRepository = likeRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.configService = configService;
        this.dataSource = dataSource;
    }
    async seedSubscriptionPlans() {
        const existingPlans = await this.subscriptionPlanRepository.count();
        if (existingPlans > 0) {
            return {
                message: 'Subscription plans already exist',
                count: existingPlans,
            };
        }
        const plans = [
            {
                name: 'Free',
                priceMonthly: 0,
                priceYearly: 0,
                features: [
                    'Create profile',
                    '5 likes per day',
                    'View profiles',
                    'Basic filters',
                ],
                maxLikesPerDay: 5,
                canSendMessages: false,
                canViewLikes: false,
                canSeeWhoLikedYou: false,
                prioritySupport: false,
                profileBadge: null,
                isActive: true,
                displayOrder: 1,
            },
            {
                name: 'Basic',
                priceMonthly: 9.99,
                priceYearly: 99.99,
                features: [
                    'Everything in Free',
                    '20 likes per day',
                    'Send messages',
                    'View your sent likes',
                    'Advanced filters',
                    'Read receipts',
                ],
                maxLikesPerDay: 20,
                canSendMessages: true,
                canViewLikes: true,
                canSeeWhoLikedYou: false,
                prioritySupport: false,
                profileBadge: 'Basic Member',
                isActive: true,
                displayOrder: 2,
            },
            {
                name: 'Premium',
                priceMonthly: 19.99,
                priceYearly: 199.99,
                features: [
                    'Everything in Basic',
                    'Unlimited likes',
                    'See who liked you',
                    'Profile boost',
                    'Advanced search',
                    'Priority customer support',
                    'Premium badge',
                ],
                maxLikesPerDay: null,
                canSendMessages: true,
                canViewLikes: true,
                canSeeWhoLikedYou: true,
                prioritySupport: true,
                profileBadge: 'Premium Member',
                isActive: true,
                displayOrder: 3,
            },
            {
                name: 'Gold',
                priceMonthly: 29.99,
                priceYearly: 299.99,
                features: [
                    'Everything in Premium',
                    'Unlimited likes',
                    'See who liked you',
                    'Profile boost (2x)',
                    'Advanced search with AI matching',
                    '24/7 Priority customer support',
                    'Gold badge',
                    'Profile verification priority',
                    'Featured profile',
                ],
                maxLikesPerDay: null,
                canSendMessages: true,
                canViewLikes: true,
                canSeeWhoLikedYou: true,
                prioritySupport: true,
                profileBadge: 'Gold Member',
                isActive: true,
                displayOrder: 4,
            },
        ];
        const savedPlans = await this.subscriptionPlanRepository.save(plans);
        return {
            message: 'Subscription plans seeded successfully',
            count: savedPlans.length,
            plans: savedPlans.map((p) => ({ id: p.id, name: p.name })),
        };
    }
    async seedSuperAdmin() {
        const email = this.configService.get('SUPER_ADMIN_EMAIL', 'superadmin@zawaj.in');
        const password = this.configService.get('SUPER_ADMIN_PASSWORD', 'SuperAdmin@123');
        const fullName = this.configService.get('SUPER_ADMIN_FULL_NAME', 'Super Administrator');
        const phone = this.configService.get('SUPER_ADMIN_PHONE', '+1234567890');
        const gender = this.configService.get('SUPER_ADMIN_GENDER', 'male');
        const existingSuperAdmin = await this.userRepository.findOne({
            where: { email },
        });
        if (existingSuperAdmin) {
            return {
                message: 'Super admin already exists',
                email: email,
            };
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const superAdmin = this.userRepository.create({
            fullName,
            email,
            phone,
            gender,
            passwordHash,
            role: 'super_admin',
            permissions: null,
            isEmailVerified: true,
            isPhoneVerified: true,
            isActive: true,
            isVerified: true,
            verifiedAt: new Date(),
        });
        await this.userRepository.save(superAdmin);
        return {
            message: 'Super admin created successfully',
            email: email,
            warning: 'Please change the password after first login',
        };
    }
    async seedAll() {
        const results = {
            superAdmin: null,
            subscriptionPlans: null,
            users: null,
            matchingPreferences: null,
            likes: null,
            conversations: null,
        };
        try {
            const adminResult = await this.seedSuperAdmin();
            results.superAdmin = adminResult.message;
            const plansResult = await this.seedSubscriptionPlans();
            results.subscriptionPlans = plansResult.message;
            const users = await (0, users_seed_1.seedUsers)(this.dataSource);
            results.users = `${users.length} users seeded`;
            await (0, matching_preferences_seed_1.seedMatchingPreferences)(this.dataSource, users);
            const prefsCount = await this.matchingPreferencesRepository.count();
            results.matchingPreferences = `${prefsCount} preferences seeded`;
            await (0, likes_seed_1.seedLikes)(this.dataSource, users);
            const likesCount = await this.likeRepository.count();
            results.likes = `${likesCount} likes seeded`;
            await (0, conversations_seed_1.seedConversations)(this.dataSource, users);
            const conversationsCount = await this.conversationRepository.count();
            const messagesCount = await this.messageRepository.count();
            results.conversations = `${conversationsCount} conversations with ${messagesCount} messages seeded`;
            return {
                success: true,
                message: 'All seeds completed successfully',
                results,
                note: 'Default password for test users: Test@123',
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Error during seeding',
                error: error.message,
                results,
            };
        }
    }
};
exports.SeedController = SeedController;
__decorate([
    (0, common_1.Post)('subscription-plans'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedController.prototype, "seedSubscriptionPlans", null);
__decorate([
    (0, common_1.Post)('super-admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedController.prototype, "seedSuperAdmin", null);
__decorate([
    (0, common_1.Post)('all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeedController.prototype, "seedAll", null);
exports.SeedController = SeedController = __decorate([
    (0, common_1.Controller)('seed'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_plan_entity_1.SubscriptionPlan)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(matching_preferences_entity_1.MatchingPreferences)),
    __param(3, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(4, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(5, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        typeorm_2.DataSource])
], SeedController);
//# sourceMappingURL=seed.controller.js.map