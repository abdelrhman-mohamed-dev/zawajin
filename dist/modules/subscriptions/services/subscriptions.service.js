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
var SubscriptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("../entities/subscription.entity");
const subscription_plan_entity_1 = require("../entities/subscription-plan.entity");
const subscription_history_entity_1 = require("../entities/subscription-history.entity");
const payment_service_1 = require("./payment.service");
let SubscriptionsService = SubscriptionsService_1 = class SubscriptionsService {
    constructor(subscriptionRepository, subscriptionPlanRepository, subscriptionHistoryRepository, paymentService) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionHistoryRepository = subscriptionHistoryRepository;
        this.paymentService = paymentService;
        this.logger = new common_1.Logger(SubscriptionsService_1.name);
    }
    async getAllPlans() {
        return this.subscriptionPlanRepository.find({
            where: { isActive: true },
            order: { displayOrder: 'ASC' },
        });
    }
    async getMySubscription(userId) {
        const subscription = await this.subscriptionRepository.findOne({
            where: {
                userId,
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            },
            relations: ['plan'],
        });
        return subscription;
    }
    async createSubscription(userId, createSubscriptionDto) {
        const { planId, billingCycle } = createSubscriptionDto;
        const existingSubscription = await this.getMySubscription(userId);
        if (existingSubscription) {
            throw new common_1.BadRequestException({
                message: 'You already have an active subscription',
                messageAr: 'لديك بالفعل اشتراك نشط',
            });
        }
        const plan = await this.subscriptionPlanRepository.findOne({
            where: { id: planId, isActive: true },
        });
        if (!plan) {
            throw new common_1.NotFoundException({
                message: 'Subscription plan not found',
                messageAr: 'خطة الاشتراك غير موجودة',
            });
        }
        const amount = billingCycle === subscription_entity_1.BillingCycle.MONTHLY
            ? plan.priceMonthly
            : plan.priceYearly;
        const startDate = new Date();
        const endDate = new Date();
        if (billingCycle === subscription_entity_1.BillingCycle.MONTHLY) {
            endDate.setMonth(endDate.getMonth() + 1);
        }
        else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }
        const paymentResult = await this.paymentService.processPayment(Number(amount));
        if (!paymentResult.success) {
            throw new common_1.BadRequestException({
                message: paymentResult.message,
                messageAr: 'فشلت عملية الدفع',
            });
        }
        const subscription = this.subscriptionRepository.create({
            userId,
            planId,
            paymentMethod: subscription_entity_1.PaymentMethod.MOCK_PAYMENT,
            status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            startDate,
            endDate,
            billingCycle,
            amount,
            currency: 'USD',
        });
        const savedSubscription = await this.subscriptionRepository.save(subscription);
        await this.createHistoryRecord(savedSubscription.id, userId, planId, subscription_history_entity_1.SubscriptionAction.CREATED, Number(amount), subscription_entity_1.PaymentMethod.MOCK_PAYMENT);
        this.logger.log(`Subscription created for user ${userId}, transaction: ${paymentResult.transactionId}`);
        return this.subscriptionRepository.findOne({
            where: { id: savedSubscription.id },
            relations: ['plan'],
        });
    }
    async cancelSubscription(userId) {
        const subscription = await this.getMySubscription(userId);
        if (!subscription) {
            throw new common_1.NotFoundException({
                message: 'No active subscription found',
                messageAr: 'لا يوجد اشتراك نشط',
            });
        }
        subscription.status = subscription_entity_1.SubscriptionStatus.CANCELLED;
        subscription.autoRenew = false;
        const updatedSubscription = await this.subscriptionRepository.save(subscription);
        await this.createHistoryRecord(subscription.id, userId, subscription.planId, subscription_history_entity_1.SubscriptionAction.CANCELLED, Number(subscription.amount), subscription.paymentMethod);
        this.logger.log(`Subscription cancelled for user ${userId}`);
        return updatedSubscription;
    }
    async upgradeSubscription(userId, upgradeSubscriptionDto) {
        const { newPlanId, billingCycle } = upgradeSubscriptionDto;
        const currentSubscription = await this.getMySubscription(userId);
        if (!currentSubscription) {
            throw new common_1.NotFoundException({
                message: 'No active subscription found',
                messageAr: 'لا يوجد اشتراك نشط',
            });
        }
        const newPlan = await this.subscriptionPlanRepository.findOne({
            where: { id: newPlanId, isActive: true },
        });
        if (!newPlan) {
            throw new common_1.NotFoundException({
                message: 'Subscription plan not found',
                messageAr: 'خطة الاشتراك غير موجودة',
            });
        }
        const newAmount = billingCycle === subscription_entity_1.BillingCycle.MONTHLY
            ? newPlan.priceMonthly
            : newPlan.priceYearly;
        const paymentResult = await this.paymentService.processPayment(Number(newAmount));
        if (!paymentResult.success) {
            throw new common_1.BadRequestException({
                message: paymentResult.message,
                messageAr: 'فشلت عملية الدفع',
            });
        }
        const action = Number(newAmount) > Number(currentSubscription.amount)
            ? subscription_history_entity_1.SubscriptionAction.UPGRADED
            : subscription_history_entity_1.SubscriptionAction.DOWNGRADED;
        currentSubscription.planId = newPlanId;
        currentSubscription.billingCycle = billingCycle;
        currentSubscription.amount = newAmount;
        const updatedSubscription = await this.subscriptionRepository.save(currentSubscription);
        await this.createHistoryRecord(currentSubscription.id, userId, newPlanId, action, Number(newAmount), subscription_entity_1.PaymentMethod.MOCK_PAYMENT);
        this.logger.log(`Subscription ${action} for user ${userId}, transaction: ${paymentResult.transactionId}`);
        return this.subscriptionRepository.findOne({
            where: { id: updatedSubscription.id },
            relations: ['plan'],
        });
    }
    async getSubscriptionHistory(userId) {
        return this.subscriptionHistoryRepository.find({
            where: { userId },
            relations: ['plan'],
            order: { createdAt: 'DESC' },
        });
    }
    async checkExpiredSubscriptions() {
        const now = new Date();
        const expiredSubscriptions = await this.subscriptionRepository.find({
            where: {
                status: subscription_entity_1.SubscriptionStatus.ACTIVE,
            },
        });
        for (const subscription of expiredSubscriptions) {
            if (subscription.endDate <= now) {
                subscription.status = subscription_entity_1.SubscriptionStatus.EXPIRED;
                await this.subscriptionRepository.save(subscription);
                await this.createHistoryRecord(subscription.id, subscription.userId, subscription.planId, subscription_history_entity_1.SubscriptionAction.EXPIRED, Number(subscription.amount), subscription.paymentMethod);
                this.logger.log(`Subscription expired for user ${subscription.userId}`);
            }
        }
    }
    async createHistoryRecord(subscriptionId, userId, planId, action, amount, paymentMethod) {
        const history = this.subscriptionHistoryRepository.create({
            subscriptionId,
            userId,
            planId,
            action,
            amount,
            paymentMethod,
        });
        await this.subscriptionHistoryRepository.save(history);
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = SubscriptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_plan_entity_1.SubscriptionPlan)),
    __param(2, (0, typeorm_1.InjectRepository)(subscription_history_entity_1.SubscriptionHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        payment_service_1.PaymentService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map