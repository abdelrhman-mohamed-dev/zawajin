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
exports.AdminReportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const permissions_guard_1 = require("../../../common/guards/permissions.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const permissions_decorator_1 = require("../../../common/decorators/permissions.decorator");
const admin_report_service_1 = require("../services/admin-report.service");
const resolve_report_dto_1 = require("../dto/resolve-report.dto");
let AdminReportController = class AdminReportController {
    constructor(adminReportService) {
        this.adminReportService = adminReportService;
    }
    async getAllReports(page, limit, status, priority, req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminReportService.getAllReports(page, limit, status, priority, lang);
    }
    async getReportById(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        return this.adminReportService.getReportById(id, lang);
    }
    async reviewReport(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminReportService.reviewReport(id, adminId, lang);
    }
    async resolveReport(id, resolveData, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminReportService.resolveReport(id, resolveData, adminId, lang);
    }
    async dismissReport(id, req) {
        const lang = req.headers['accept-language'] || 'en';
        const adminId = req.user.id;
        return this.adminReportService.dismissReport(id, adminId, lang);
    }
};
exports.AdminReportController = AdminReportController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('manage_reports'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user reports' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'priority', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reports fetched successfully' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('priority')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminReportController.prototype, "getAllReports", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('manage_reports'),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get report details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report fetched successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminReportController.prototype, "getReportById", null);
__decorate([
    (0, common_1.Put)(':id/review'),
    (0, permissions_decorator_1.RequirePermissions)('manage_reports'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Mark report as reviewed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report marked as reviewed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminReportController.prototype, "reviewReport", null);
__decorate([
    (0, common_1.Put)(':id/resolve'),
    (0, permissions_decorator_1.RequirePermissions)('manage_reports'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve report with action' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report resolved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, resolve_report_dto_1.ResolveReportDto, Object]),
    __metadata("design:returntype", Promise)
], AdminReportController.prototype, "resolveReport", null);
__decorate([
    (0, common_1.Put)(':id/dismiss'),
    (0, permissions_decorator_1.RequirePermissions)('manage_reports'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Dismiss report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report dismissed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminReportController.prototype, "dismissReport", null);
exports.AdminReportController = AdminReportController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Report Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, roles_decorator_1.Roles)('admin', 'super_admin'),
    __metadata("design:paramtypes", [admin_report_service_1.AdminReportService])
], AdminReportController);
//# sourceMappingURL=admin-report.controller.js.map