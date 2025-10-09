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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoleService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const user_repository_1 = require("../../auth/repositories/user.repository");
const admin_action_repository_1 = require("../repositories/admin-action.repository");
const bcrypt = require("bcrypt");
let AdminRoleService = class AdminRoleService {
    constructor(userRepository, adminActionRepository, i18n) {
        this.userRepository = userRepository;
        this.adminActionRepository = adminActionRepository;
        this.i18n = i18n;
    }
    async getAllAdmins(page = 1, limit = 20, lang = 'en') {
        const admins = await this.userRepository.findAll(page, limit, undefined, 'admin');
        const superAdmins = await this.userRepository.findAll(page, limit, undefined, 'super_admin');
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.adminsFetched', { lang }),
            data: {
                admins: [...admins.users, ...superAdmins.users],
                total: admins.total + superAdmins.total,
            },
        };
    }
    async createAdmin(adminData, superAdminId, lang = 'en') {
        const existingUser = await this.userRepository.findByEmail(adminData.email);
        if (existingUser) {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.emailExists', { lang }));
        }
        const passwordHash = await bcrypt.hash(adminData.password, 12);
        const admin = await this.userRepository.create({
            ...adminData,
            passwordHash,
            role: 'admin',
            permissions: adminData.permissions || [],
            roleAssignedBy: superAdminId,
            roleAssignedAt: new Date(),
            isActive: true,
            isEmailVerified: true,
        });
        await this.adminActionRepository.create({
            adminId: superAdminId,
            actionType: 'create_admin',
            targetUserId: admin.id,
            reason: 'Admin user created',
            metadata: { permissions: adminData.permissions || [] },
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.adminCreated', { lang }),
            data: admin,
        };
    }
    async updateAdminRoles(userId, rolesData, superAdminId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (user.role !== 'admin' && user.role !== 'super_admin') {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.userNotAdmin', { lang }));
        }
        await this.userRepository.update(userId, {
            permissions: rolesData.permissions,
        });
        await this.adminActionRepository.create({
            adminId: superAdminId,
            actionType: 'promote_admin',
            targetUserId: userId,
            reason: 'Admin roles updated',
            metadata: { permissions: rolesData.permissions },
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.adminRolesUpdated', { lang }),
        };
    }
    async promoteToSuperAdmin(userId, superAdminId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (user.role === 'super_admin') {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.userAlreadyAdmin', { lang }));
        }
        await this.userRepository.update(userId, {
            role: 'super_admin',
            permissions: null,
            roleAssignedBy: superAdminId,
            roleAssignedAt: new Date(),
        });
        await this.adminActionRepository.create({
            adminId: superAdminId,
            actionType: 'promote_admin',
            targetUserId: userId,
            reason: 'Promoted to super admin',
            metadata: {},
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.adminPromoted', { lang }),
        };
    }
    async demoteToAdmin(userId, superAdminId, lang = 'en') {
        if (userId === superAdminId) {
            throw new common_1.ForbiddenException(await this.i18n.translate('admin.errors.cannotDemoteSelf', { lang }));
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (user.role !== 'super_admin') {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.userNotAdmin', { lang }));
        }
        await this.userRepository.update(userId, {
            role: 'admin',
            permissions: ['manage_users', 'manage_reports', 'view_analytics'],
            roleAssignedBy: superAdminId,
            roleAssignedAt: new Date(),
        });
        await this.adminActionRepository.create({
            adminId: superAdminId,
            actionType: 'demote_admin',
            targetUserId: userId,
            reason: 'Demoted to admin',
            metadata: {},
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.adminDemoted', { lang }),
        };
    }
    async removeAdminPrivileges(userId, superAdminId, lang = 'en') {
        if (userId === superAdminId) {
            throw new common_1.ForbiddenException(await this.i18n.translate('admin.errors.cannotRemoveSelf', { lang }));
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (user.role !== 'admin' && user.role !== 'super_admin') {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.userNotAdmin', { lang }));
        }
        await this.userRepository.update(userId, {
            role: 'user',
            permissions: null,
            roleAssignedBy: null,
            roleAssignedAt: null,
        });
        await this.adminActionRepository.create({
            adminId: superAdminId,
            actionType: 'remove_admin',
            targetUserId: userId,
            reason: 'Admin privileges removed',
            metadata: {},
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.adminRemoved', { lang }),
        };
    }
};
exports.AdminRoleService = AdminRoleService;
exports.AdminRoleService = AdminRoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        admin_action_repository_1.AdminActionRepository,
        nestjs_i18n_1.I18nService])
], AdminRoleService);
//# sourceMappingURL=admin-role.service.js.map