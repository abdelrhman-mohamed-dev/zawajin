import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserRepository } from '../../auth/repositories/user.repository';
import { AdminActionRepository } from '../repositories/admin-action.repository';
import { ActivityLogRepository } from '../repositories/activity-log.repository';
import { AdminNotificationRepository } from '../repositories/admin-notification.repository';
import { MailService } from '../../mail/services/mail.service';
import { FirebaseService } from '../../../services/firebase.service';
import { UpdateUserAdminDto } from '../dto/update-user-admin.dto';
import { BanUserDto } from '../dto/ban-user.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminActionRepository: AdminActionRepository,
    private readonly activityLogRepository: ActivityLogRepository,
    private readonly adminNotificationRepository: AdminNotificationRepository,
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
    private readonly i18n: I18nService,
  ) {}

  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: string,
    isBanned?: boolean,
    isVerified?: boolean,
  ) {
    const users = await this.userRepository.findAll(
      page,
      limit,
      search,
      role,
      isBanned,
      isVerified,
    );

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.usersFetched'),
      data: users,
    };
  }

  async getUserById(userId: string, lang: string = 'en') {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.userNotFound', { lang }),
      );
    }

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.userFetched', {
        lang,
      }),
      data: user,
    };
  }

  async updateUser(
    userId: string,
    updateData: UpdateUserAdminDto,
    adminId: string,
    lang: string = 'en',
  ) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.userNotFound', { lang }),
      );
    }

    // Check for email uniqueness if email is being updated
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateData.email,
      );
      if (existingUser) {
        throw new ConflictException(
          await this.i18n.translate('auth.errors.emailExists', { lang }),
        );
      }
    }

    // Update user
    const updatedUser = await this.userRepository.update(userId, updateData);

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'edit_user',
      targetUserId: userId,
      reason: 'Admin updated user profile',
      metadata: { updatedFields: Object.keys(updateData) },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.userUpdated', {
        lang,
      }),
      data: updatedUser,
    };
  }

  async banUser(
    userId: string,
    banData: BanUserDto,
    adminId: string,
    lang: string = 'en',
  ) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.userNotFound', { lang }),
      );
    }

    if (user.isBanned) {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.userAlreadyBanned', { lang }),
      );
    }

    // Prevent banning admins or super_admins
    if (user.role === 'admin' || user.role === 'super_admin') {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.cannotBanAdmin', { lang }),
      );
    }

    const bannedUntil =
      banData.banType === 'temporary' && banData.bannedUntil
        ? new Date(banData.bannedUntil)
        : null;

    await this.userRepository.update(userId, {
      isBanned: true,
      banType: banData.banType,
      bannedAt: new Date(),
      bannedUntil,
      bannedReason: banData.reason,
      bannedBy: adminId,
    });

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'ban_user',
      targetUserId: userId,
      reason: banData.reason,
      metadata: { banType: banData.banType, bannedUntil },
    });

    // Send notification to user
    if (user.fcmToken) {
      try {
        await this.firebaseService.sendNotification(
          user.fcmToken,
          await this.i18n.translate('admin.notifications.banned.title', {
            lang,
          }),
          await this.i18n.translate('admin.notifications.banned.body', {
            lang,
            args: { reason: banData.reason },
          }),
        );
      } catch (error) {
        // Log but don't fail the ban operation
        console.error('Failed to send ban notification:', error);
      }
    }

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.userBanned', { lang }),
    };
  }

  async unbanUser(userId: string, adminId: string, lang: string = 'en') {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.userNotFound', { lang }),
      );
    }

    if (!user.isBanned) {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.userNotBanned', { lang }),
      );
    }

    await this.userRepository.update(userId, {
      isBanned: false,
      banType: null,
      bannedAt: null,
      bannedUntil: null,
      bannedReason: null,
      bannedBy: null,
    });

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'unban_user',
      targetUserId: userId,
      reason: 'User unbanned by admin',
      metadata: {},
    });

    // Send notification to user
    if (user.fcmToken) {
      try {
        await this.firebaseService.sendNotification(
          user.fcmToken,
          await this.i18n.translate('admin.notifications.unbanned.title', {
            lang,
          }),
          await this.i18n.translate('admin.notifications.unbanned.body', {
            lang,
          }),
        );
      } catch (error) {
        console.error('Failed to send unban notification:', error);
      }
    }

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.userUnbanned', {
        lang,
      }),
    };
  }

  async deleteUser(userId: string, adminId: string, lang: string = 'en') {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.userNotFound', { lang }),
      );
    }

    if (user.isDeleted) {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.userAlreadyDeleted', { lang }),
      );
    }

    // Prevent deleting admins or super_admins
    if (user.role === 'admin' || user.role === 'super_admin') {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.cannotDeleteAdmin', { lang }),
      );
    }

    await this.userRepository.update(userId, {
      isDeleted: true,
      deletedAt: new Date(),
      isActive: false,
    });

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'delete_user',
      targetUserId: userId,
      reason: 'User account disabled by admin',
      metadata: {},
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.userDeleted', {
        lang,
      }),
    };
  }

  async verifyUser(userId: string, adminId: string, lang: string = 'en') {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.userNotFound', { lang }),
      );
    }

    if (user.isVerified) {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.userAlreadyVerified', { lang }),
      );
    }

    await this.userRepository.update(userId, {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: adminId,
    });

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'verify_user',
      targetUserId: userId,
      reason: 'User profile verified by admin',
      metadata: {},
    });

    // Send notification to user
    if (user.fcmToken) {
      try {
        await this.firebaseService.sendNotification(
          user.fcmToken,
          await this.i18n.translate('admin.notifications.verified.title', {
            lang,
          }),
          await this.i18n.translate('admin.notifications.verified.body', {
            lang,
          }),
        );
      } catch (error) {
        console.error('Failed to send verification notification:', error);
      }
    }

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.userVerified', {
        lang,
      }),
    };
  }

  async sendNotificationToUser(
    userId: string,
    notificationData: SendNotificationDto,
    adminId: string,
    lang: string = 'en',
  ) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.userNotFound', { lang }),
      );
    }

    let status = 'sent';

    try {
      if (notificationData.notificationType === 'email') {
        await this.mailService.sendAdminNotification(
          user.email,
          notificationData.subject,
          notificationData.message,
        );
      } else if (
        notificationData.notificationType === 'push' &&
        user.fcmToken
      ) {
        await this.firebaseService.sendNotification(
          user.fcmToken,
          notificationData.subject,
          notificationData.message,
        );
      }
      status = 'delivered';
    } catch (error) {
      console.error('Failed to send notification:', error);
      status = 'failed';
    }

    // Save notification record
    await this.adminNotificationRepository.create({
      recipientId: userId,
      senderId: adminId,
      subject: notificationData.subject,
      message: notificationData.message,
      notificationType: notificationData.notificationType,
      status,
      sentAt: new Date(),
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.notificationSent', {
        lang,
      }),
      data: { status },
    };
  }

  async getUserActivityLogs(
    userId: string,
    page: number = 1,
    limit: number = 50,
    lang: string = 'en',
  ) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.userNotFound', { lang }),
      );
    }

    const logs = await this.activityLogRepository.findByUserId(
      userId,
      page,
      limit,
    );

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.activityLogsFetched', {
        lang,
      }),
      data: logs,
    };
  }
}
