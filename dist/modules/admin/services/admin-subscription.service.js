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
exports.AdminSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nestjs_i18n_1 = require("nestjs-i18n");
const subscription_plan_entity_1 = require("../../subscriptions/entities/subscription-plan.entity");
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
const admin_action_entity_1 = require("../entities/admin-action.entity");
let AdminSubscriptionService = class AdminSubscriptionService {
    constructor(subscriptionPlanRepository, subscriptionRepository, adminActionRepository, i18n) {
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.adminActionRepository = adminActionRepository;
        this.i18n = i18n;
    }
    async getAllSubscriptionPlans(lang = 'en') {
        const plans = await this.subscriptionPlanRepository.find({
            order: { displayOrder: 'ASC' },
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.subscriptionPlansFetched', { lang }),
            data: plans,
        };
    }
    async getAllSubscriptions(page = 1, limit = 20, lang = 'en') {
        const skip = (page - 1) * limit;
        const [subscriptions, total] = await this.subscriptionRepository.findAndCount({
            relations: ['user', 'plan'],
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.subscriptionsFetched', { lang }),
            data: {
                subscriptions: subscriptions.map((sub) => ({
                    id: sub.id,
                    userId: sub.userId,
                    userName: sub.user.fullName,
                    userEmail: sub.user.email,
                    planId: sub.planId,
                    planName: sub.plan.name,
                    status: sub.status,
                    billingCycle: sub.billingCycle,
                    amount: sub.amount,
                    currency: sub.currency,
                    startDate: sub.startDate,
                    endDate: sub.endDate,
                    autoRenew: sub.autoRenew,
                    createdAt: sub.createdAt,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    async createPlan(createPlanDto, adminId, lang = 'en') {
        const existing = await this.subscriptionPlanRepository.findOne({
            where: { name: createPlanDto.name },
        });
        if (existing) {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.planAlreadyExists', { lang }));
        }
        const plan = this.subscriptionPlanRepository.create({
            ...createPlanDto,
            isActive: true,
        });
        const savedPlan = await this.subscriptionPlanRepository.save(plan);
        await this.logAdminAction(adminId, 'create_plan', null, savedPlan.id, 'Created new subscription plan', { planName: savedPlan.name });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.planCreated', { lang }),
            data: savedPlan,
        };
    }
    async updatePlan(planId, updatePlanDto, adminId, lang = 'en') {
        const plan = await this.subscriptionPlanRepository.findOne({
            where: { id: planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.planNotFound', { lang }));
        }
        if (updatePlanDto.name && updatePlanDto.name !== plan.name) {
            const existing = await this.subscriptionPlanRepository.findOne({
                where: { name: updatePlanDto.name },
            });
            if (existing) {
                throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.planNameExists', { lang }));
            }
        }
        Object.assign(plan, updatePlanDto);
        const updatedPlan = await this.subscriptionPlanRepository.save(plan);
        await this.logAdminAction(adminId, 'edit_plan', null, planId, 'Updated subscription plan', { planName: plan.name, changes: updatePlanDto });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.planUpdated', { lang }),
            data: updatedPlan,
        };
    }
    async deactivatePlan(planId, adminId, lang = 'en') {
        const plan = await this.subscriptionPlanRepository.findOne({
            where: { id: planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.planNotFound', { lang }));
        }
        const activeSubscriptionsCount = await this.subscriptionRepository.count({
            where: { planId, status: subscription_entity_1.SubscriptionStatus.ACTIVE },
        });
        if (activeSubscriptionsCount > 0) {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.planHasActiveSubscriptions', {
                lang,
                args: { count: activeSubscriptionsCount },
            }));
        }
        plan.isActive = false;
        await this.subscriptionPlanRepository.save(plan);
        await this.logAdminAction(adminId, 'deactivate_plan', null, planId, 'Deactivated subscription plan', { planName: plan.name });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.planDeactivated', { lang }),
            data: plan,
        };
    }
    async logAdminAction(adminId, actionType, targetUserId, targetId, reason, metadata) {
        const action = this.adminActionRepository.create({
            adminId,
            actionType,
            targetUserId,
            targetId,
            reason,
            metadata,
        });
        await this.adminActionRepository.save(action);
    }
};
exports.AdminSubscriptionService = AdminSubscriptionService;
exports.AdminSubscriptionService = AdminSubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_plan_entity_1.SubscriptionPlan)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(2, (0, typeorm_1.InjectRepository)(admin_action_entity_1.AdminAction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        nestjs_i18n_1.I18nService])
], AdminSubscriptionService);
//# sourceMappingURL=admin-subscription.service.js.map