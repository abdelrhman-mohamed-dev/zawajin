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
exports.AdminRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const admin_role_service_1 = require("../services/admin-role.service");
const create_admin_dto_1 = require("../dto/create-admin.dto");
const update_admin_roles_dto_1 = require("../dto/update-admin-roles.dto");
let AdminRoleController = class AdminRoleController {
    constructor(adminRoleService) {
        this.adminRoleService = adminRoleService;
    }
    async getAllAdmins(page, limit, req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminRoleService.getAllAdmins(page, limit, lang);
    }
    async createAdmin(adminData, req) {
        const lang = req.headers['accept-language'] || 'en';
        const superAdminId = req.user.id;
        return this.adminRoleService.createAdmin(adminData, superAdminId, lang);
    }
    async updateAdminRoles(id, rolesData, req) {
        const lang = req.headers['accept-language'] || 'en';
        const superAdminId = req.user.id;
        return this.adminRoleService.updateAdminRoles(id, rolesData, superAdminId, lang);
    }
    async promoteToSuperAdmin(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const superAdminId = req.user.id;
        return this.adminRoleService.promoteToSuperAdmin(id, superAdminId, lang);
    }
    async demoteToAdmin(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const superAdminId = req.user.id;
        return this.adminRoleService.demoteToAdmin(id, superAdminId, lang);
    }
    async removeAdminPrivileges(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const superAdminId = req.user.id;
        return this.adminRoleService.removeAdminPrivileges(id, superAdminId, lang);
    }
};
exports.AdminRoleController = AdminRoleController;
__decorate([
    (0, common_1.Get)(),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all admin users (super admin only)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admins fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Super admin only' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "getAllAdmins", null);
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create new admin user (super admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email already exists' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Super admin only' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Put)(':id/roles'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Update admin roles/permissions (super admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin roles updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Super admin only' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_roles_dto_1.UpdateAdminRolesDto, Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "updateAdminRoles", null);
__decorate([
    (0, common_1.Put)(':id/promote'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Promote admin to super_admin (super admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin promoted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Super admin only' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "promoteToSuperAdmin", null);
__decorate([
    (0, common_1.Put)(':id/demote'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Demote super_admin to admin (super admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Super admin demoted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Cannot demote yourself' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "demoteToAdmin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Remove admin privileges (super admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin privileges removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Cannot remove your own privileges' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminRoleController.prototype, "removeAdminPrivileges", null);
exports.AdminRoleController = AdminRoleController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Role Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/admins'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('super_admin'),
    __metadata("design:paramtypes", [admin_role_service_1.AdminRoleService])
], AdminRoleController);
//# sourceMappingURL=admin-role.controller.js.map