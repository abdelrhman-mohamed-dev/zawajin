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
exports.AdminAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const admin_analytics_service_1 = require("../services/admin-analytics.service");
let AdminAnalyticsController = class AdminAnalyticsController {
    constructor(adminAnalyticsService) {
        this.adminAnalyticsService = adminAnalyticsService;
    }
    async getOverview(req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminAnalyticsService.getOverview(lang);
    }
    async getUserAnalytics(req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminAnalyticsService.getUserAnalytics(lang);
    }
    async getMatchAnalytics(any) {
        const lang = any.headers['accept-language'] || 'en';
        return this.adminAnalyticsService.getMatchAnalytics(lang);
    }
    async getMessageAnalytics(req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminAnalyticsService.getMessageAnalytics(lang);
    }
    async getSubscriptionAnalytics(req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminAnalyticsService.getSubscriptionAnalytics(lang);
    }
};
exports.AdminAnalyticsController = AdminAnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, permissions_decorator_1.RequirePermissions)('view_analytics'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overview fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, permissions_decorator_1.RequirePermissions)('view_analytics'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'User analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User analytics fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('matches'),
    (0, permissions_decorator_1.RequirePermissions)('view_analytics'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Match analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Match analytics fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getMatchAnalytics", null);
__decorate([
    (0, common_1.Get)('messages'),
    (0, permissions_decorator_1.RequirePermissions)('view_analytics'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Messaging analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messaging analytics fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getMessageAnalytics", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    (0, permissions_decorator_1.RequirePermissions)('view_analytics'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Subscription analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription analytics fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getSubscriptionAnalytics", null);
exports.AdminAnalyticsController = AdminAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    __metadata("design:paramtypes", [admin_analytics_service_1.AdminAnalyticsService])
], AdminAnalyticsController);
//# sourceMappingURL=admin-analytics.controller.js.map