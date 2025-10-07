import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserRepository } from '../../auth/repositories/user.repository';
import { AdminActionRepository } from '../repositories/admin-action.repository';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminRolesDto } from '../dto/update-admin-roles.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminRoleService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminActionRepository: AdminActionRepository,
    private readonly i18n: I18nService,
  ) {}

  async getAllAdmins(page: number = 1, limit: number = 20, lang: string = 'en') {
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

  async createAdmin(adminData: CreateAdminDto, superAdminId: string, lang: string = 'en') {
    // Check if email exists
    const existingUser = await this.userRepository.findByEmail(adminData.email);
    if (existingUser) {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.emailExists', { lang }),
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminData.password, 12);

    // Create admin user
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

    // Log action
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

  async updateAdminRoles(userId: string, rolesData: UpdateAdminRolesDto, superAdminId: string, lang: string = 'en') {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
    }

    if (user.role !== 'admin' && user.role !== 'super_admin') {
      throw new BadRequestException(await this.i18n.translate('admin.errors.userNotAdmin', { lang }));
    }

    await this.userRepository.update(userId, {
      permissions: rolesData.permissions,
    });

    // Log action
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

  async promoteToSuperAdmin(userId: string, superAdminId: string, lang: string = 'en') {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
    }

    if (user.role === 'super_admin') {
      throw new BadRequestException(await this.i18n.translate('admin.errors.userAlreadyAdmin', { lang }));
    }

    await this.userRepository.update(userId, {
      role: 'super_admin',
      permissions: null, // Super admins have all permissions
      roleAssignedBy: superAdminId,
      roleAssignedAt: new Date(),
    });

    // Log action
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

  async demoteToAdmin(userId: string, superAdminId: string, lang: string = 'en') {
    if (userId === superAdminId) {
      throw new ForbiddenException(await this.i18n.translate('admin.errors.cannotDemoteSelf', { lang }));
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
    }

    if (user.role !== 'super_admin') {
      throw new BadRequestException(await this.i18n.translate('admin.errors.userNotAdmin', { lang }));
    }

    await this.userRepository.update(userId, {
      role: 'admin',
      permissions: ['manage_users', 'manage_reports', 'view_analytics'], // Default admin permissions
      roleAssignedBy: superAdminId,
      roleAssignedAt: new Date(),
    });

    // Log action
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

  async removeAdminPrivileges(userId: string, superAdminId: string, lang: string = 'en') {
    if (userId === superAdminId) {
      throw new ForbiddenException(await this.i18n.translate('admin.errors.cannotRemoveSelf', { lang }));
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
    }

    if (user.role !== 'admin' && user.role !== 'super_admin') {
      throw new BadRequestException(await this.i18n.translate('admin.errors.userNotAdmin', { lang }));
    }

    await this.userRepository.update(userId, {
      role: 'user',
      permissions: null,
      roleAssignedBy: null,
      roleAssignedAt: null,
    });

    // Log action
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
}
