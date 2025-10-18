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
exports.AdminSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const admin_subscription_service_1 = require("../services/admin-subscription.service");
const create_plan_dto_1 = require("../../subscriptions/dto/create-plan.dto");
const update_plan_dto_1 = require("../../subscriptions/dto/update-plan.dto");
let AdminSubscriptionController = class AdminSubscriptionController {
    constructor(adminSubscriptionService) {
        this.adminSubscriptionService = adminSubscriptionService;
    }
    async getAllPlans(req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminSubscriptionService.getAllSubscriptionPlans(lang);
    }
    async getAllSubscriptions(page, limit, req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminSubscriptionService.getAllSubscriptions(page, limit, lang);
    }
    async createPlan(createPlanDto, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.sub;
        return this.adminSubscriptionService.createPlan(createPlanDto, adminId, lang);
    }
    async updatePlan(id, updatePlanDto, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.sub;
        return this.adminSubscriptionService.updatePlan(id, updatePlanDto, adminId, lang);
    }
    async deactivatePlan(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.sub;
        return this.adminSubscriptionService.deactivatePlan(id, adminId, lang);
    }
};
exports.AdminSubscriptionController = AdminSubscriptionController;
__decorate([
    (0, common_1.Get)('plans'),
    (0, permissions_decorator_1.RequirePermissions)('manage_subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subscription plans' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription plans fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionController.prototype, "getAllPlans", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('manage_subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active subscriptions' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscriptions fetched successfully' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionController.prototype, "getAllSubscriptions", null);
__decorate([
    (0, common_1.Post)('plans'),
    (0, permissions_decorator_1.RequirePermissions)('manage_subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new subscription plan' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subscription plan created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreatePlanDto, Object]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Put)('plans/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)('manage_subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Update subscription plan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription plan updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscription plan not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_dto_1.UpdatePlanDto, Object]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Delete)('plans/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)('manage_subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate subscription plan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription plan deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Subscription plan not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot deactivate plan with active subscriptions' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionController.prototype, "deactivatePlan", null);
exports.AdminSubscriptionController = AdminSubscriptionController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Subscription Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    __metadata("design:paramtypes", [admin_subscription_service_1.AdminSubscriptionService])
], AdminSubscriptionController);
//# sourceMappingURL=admin-subscription.controller.js.map