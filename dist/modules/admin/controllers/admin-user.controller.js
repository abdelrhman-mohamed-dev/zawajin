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
exports.AdminUserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const admin_user_service_1 = require("../services/admin-user.service");
const update_user_admin_dto_1 = require("../dto/update-user-admin.dto");
const ban_user_dto_1 = require("../dto/ban-user.dto");
const send_notification_dto_1 = require("../dto/send-notification.dto");
let AdminUserController = class AdminUserController {
    constructor(adminUserService) {
        this.adminUserService = adminUserService;
    }
    async getAllUsers(page, limit, search, role, isBanned, isVerified) {
        return this.adminUserService.getAllUsers(page, limit, search, role, isBanned, isVerified);
    }
    async getUserById(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminUserService.getUserById(id, lang);
    }
    async updateUser(id, updateData, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminUserService.updateUser(id, updateData, adminId, lang);
    }
    async banUser(id, banData, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminUserService.banUser(id, banData, adminId, lang);
    }
    async unbanUser(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminUserService.unbanUser(id, adminId, lang);
    }
    async deleteUser(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminUserService.deleteUser(id, adminId, lang);
    }
    async verifyUser(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminUserService.verifyUser(id, adminId, lang);
    }
    async sendNotification(id, notificationData, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminUserService.sendNotificationToUser(id, notificationData, adminId, lang);
    }
    async sendEmail(id, notificationData, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminUserService.sendNotificationToUser(id, { ...notificationData, notificationType: 'email' }, adminId, lang);
    }
    async getUserActivityLogs(id, page, limit, req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminUserService.getUserActivityLogs(id, page, limit, lang);
    }
};
exports.AdminUserController = AdminUserController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('manage_users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'isBanned', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'isVerified', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('role')),
    __param(4, (0, common_1.Query)('isBanned')),
    __param(5, (0, common_1.Query)('isVerified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('manage_users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed user info' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('manage_users'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile (admin override)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_admin_dto_1.UpdateUserAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)(':id/ban'),
    (0, permissions_decorator_1.RequirePermissions)('manage_users'),
    (0, swagger_1.ApiOperation)({ summary: 'Ban user (temporary or permanent)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User banned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User already banned' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ban_user_dto_1.BanUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "banUser", null);
__decorate([
    (0, common_1.Post)(':id/unban'),
    (0, permissions_decorator_1.RequirePermissions)('manage_users'),
    (0, swagger_1.ApiOperation)({ summary: 'Unban user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User unbanned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User not banned' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "unbanUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('manage_users'),
    (0, swagger_1.ApiOperation)({ summary: 'Disable/delete user account (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, permissions_decorator_1.RequirePermissions)('verify_users'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually verify user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'User already verified' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "verifyUser", null);
__decorate([
    (0, common_1.Post)(':id/send-notification'),
    (0, permissions_decorator_1.RequirePermissions)('send_notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Send notification to user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_notification_dto_1.SendNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)(':id/send-email'),
    (0, permissions_decorator_1.RequirePermissions)('send_notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Send email to user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, send_notification_dto_1.SendNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Get)(':id/activity-logs'),
    (0, permissions_decorator_1.RequirePermissions)('manage_users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user activity logs' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity logs fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminUserController.prototype, "getUserActivityLogs", null);
exports.AdminUserController = AdminUserController = __decorate([
    (0, swagger_1.ApiTags)('Admin - User Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    __metadata("design:paramtypes", [admin_user_service_1.AdminUserService])
], AdminUserController);
//# sourceMappingURL=admin-user.controller.js.map