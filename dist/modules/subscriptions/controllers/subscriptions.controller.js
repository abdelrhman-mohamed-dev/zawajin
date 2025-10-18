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
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const subscriptions_service_1 = require("../services/subscriptions.service");
const create_subscription_dto_1 = require("../dto/create-subscription.dto");
const upgrade_subscription_dto_1 = require("../dto/upgrade-subscription.dto");
const subscription_response_dto_1 = require("../dto/subscription-response.dto");
let SubscriptionsController = class SubscriptionsController {
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    async getAllPlans() {
        return this.subscriptionsService.getAllPlans();
    }
    async getMySubscription(req) {
        return this.subscriptionsService.getMySubscription(req.user.userId);
    }
    async createSubscription(req, createSubscriptionDto) {
        return this.subscriptionsService.createSubscription(req.user.userId, createSubscriptionDto);
    }
    async upgradeSubscription(req, upgradeSubscriptionDto) {
        return this.subscriptionsService.upgradeSubscription(req.user.userId, upgradeSubscriptionDto);
    }
    async cancelSubscription(req) {
        return this.subscriptionsService.cancelSubscription(req.user.userId);
    }
    async getSubscriptionHistory(req) {
        return this.subscriptionsService.getSubscriptionHistory(req.user.userId);
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available subscription plans' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns all active subscription plans',
        type: [subscription_response_dto_1.SubscriptionPlanResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "getAllPlans", null);
__decorate([
    (0, common_1.Get)('my-subscription'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user subscription' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns current user active subscription',
        type: subscription_response_dto_1.SubscriptionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No active subscription found',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "getMySubscription", null);
__decorate([
    (0, common_1.Post)('create-subscription'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create new subscription' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Subscription created successfully',
        type: subscription_response_dto_1.SubscriptionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - User already has active subscription or payment failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Subscription plan not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Post)('upgrade'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Upgrade subscription plan' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscription upgraded successfully',
        type: subscription_response_dto_1.SubscriptionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Payment failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No active subscription or plan not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upgrade_subscription_dto_1.UpgradeSubscriptionDto]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "upgradeSubscription", null);
__decorate([
    (0, common_1.Post)('cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel subscription' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Subscription cancelled successfully',
        type: subscription_response_dto_1.SubscriptionResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No active subscription found',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription history' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns subscription history',
        type: [subscription_response_dto_1.SubscriptionHistoryResponseDto],
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionsController.prototype, "getSubscriptionHistory", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map