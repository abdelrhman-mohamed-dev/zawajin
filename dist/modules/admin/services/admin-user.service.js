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
exports.AdminUserService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const user_repository_1 = require("../../auth/repositories/user.repository");
const admin_action_repository_1 = require("../repositories/admin-action.repository");
const activity_log_repository_1 = require("../repositories/activity-log.repository");
const admin_notification_repository_1 = require("../repositories/admin-notification.repository");
const mail_service_1 = require("../../mail/services/mail.service");
const firebase_service_1 = require("../../../services/firebase.service");
let AdminUserService = class AdminUserService {
    constructor(userRepository, adminActionRepository, activityLogRepository, adminNotificationRepository, mailService, firebaseService, i18n) {
        this.userRepository = userRepository;
        this.adminActionRepository = adminActionRepository;
        this.activityLogRepository = activityLogRepository;
        this.adminNotificationRepository = adminNotificationRepository;
        this.mailService = mailService;
        this.firebaseService = firebaseService;
        this.i18n = i18n;
    }
    async getAllUsers(page = 1, limit = 20, search, role, isBanned, isVerified) {
        const users = await this.userRepository.findAll(page, limit, search, role, isBanned, isVerified);
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.usersFetched'),
            data: users,
        };
    }
    async getUserById(userId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.userFetched', {
                lang,
            }),
            data: user,
        };
    }
    async updateUser(userId, updateData, adminId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.userRepository.findByEmail(updateData.email);
            if (existingUser) {
                throw new common_1.ConflictException(await this.i18n.translate('auth.errors.emailExists', { lang }));
            }
        }
        const updatedUser = await this.userRepository.update(userId, updateData);
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
    async banUser(userId, banData, adminId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (user.isBanned) {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.userAlreadyBanned', { lang }));
        }
        if (user.role === 'admin' || user.role === 'super_admin') {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.cannotBanAdmin', { lang }));
        }
        const bannedUntil = banData.banType === 'temporary' && banData.bannedUntil
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
        await this.adminActionRepository.create({
            adminId,
            actionType: 'ban_user',
            targetUserId: userId,
            reason: banData.reason,
            metadata: { banType: banData.banType, bannedUntil },
        });
        if (user.fcmToken) {
            try {
                await this.firebaseService.sendNotification(user.fcmToken, await this.i18n.translate('admin.notifications.banned.title', {
                    lang,
                }), await this.i18n.translate('admin.notifications.banned.body', {
                    lang,
                    args: { reason: banData.reason },
                }));
            }
            catch (error) {
                console.error('Failed to send ban notification:', error);
            }
        }
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.userBanned', { lang }),
        };
    }
    async unbanUser(userId, adminId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (!user.isBanned) {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.userNotBanned', { lang }));
        }
        await this.userRepository.update(userId, {
            isBanned: false,
            banType: null,
            bannedAt: null,
            bannedUntil: null,
            bannedReason: null,
            bannedBy: null,
        });
        await this.adminActionRepository.create({
            adminId,
            actionType: 'unban_user',
            targetUserId: userId,
            reason: 'User unbanned by admin',
            metadata: {},
        });
        if (user.fcmToken) {
            try {
                await this.firebaseService.sendNotification(user.fcmToken, await this.i18n.translate('admin.notifications.unbanned.title', {
                    lang,
                }), await this.i18n.translate('admin.notifications.unbanned.body', {
                    lang,
                }));
            }
            catch (error) {
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
    async deleteUser(userId, adminId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (user.isDeleted) {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.userAlreadyDeleted', { lang }));
        }
        if (user.role === 'admin' || user.role === 'super_admin') {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.cannotDeleteAdmin', { lang }));
        }
        await this.userRepository.update(userId, {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false,
        });
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
    async verifyUser(userId, adminId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        if (user.isVerified) {
            throw new common_1.BadRequestException(await this.i18n.translate('admin.errors.userAlreadyVerified', { lang }));
        }
        await this.userRepository.update(userId, {
            isVerified: true,
            verifiedAt: new Date(),
            verifiedBy: adminId,
        });
        await this.adminActionRepository.create({
            adminId,
            actionType: 'verify_user',
            targetUserId: userId,
            reason: 'User profile verified by admin',
            metadata: {},
        });
        if (user.fcmToken) {
            try {
                await this.firebaseService.sendNotification(user.fcmToken, await this.i18n.translate('admin.notifications.verified.title', {
                    lang,
                }), await this.i18n.translate('admin.notifications.verified.body', {
                    lang,
                }));
            }
            catch (error) {
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
    async sendNotificationToUser(userId, notificationData, adminId, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        let status = 'sent';
        try {
            if (notificationData.notificationType === 'email') {
                await this.mailService.sendAdminNotification(user.email, notificationData.subject, notificationData.message);
            }
            else if (notificationData.notificationType === 'push' &&
                user.fcmToken) {
                await this.firebaseService.sendNotification(user.fcmToken, notificationData.subject, notificationData.message);
            }
            status = 'delivered';
        }
        catch (error) {
            console.error('Failed to send notification:', error);
            status = 'failed';
        }
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
    async getUserActivityLogs(userId, page = 1, limit = 50, lang = 'en') {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(await this.i18n.translate('admin.errors.userNotFound', { lang }));
        }
        const logs = await this.activityLogRepository.findByUserId(userId, page, limit);
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.activityLogsFetched', {
                lang,
            }),
            data: logs,
        };
    }
};
exports.AdminUserService = AdminUserService;
exports.AdminUserService = AdminUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        admin_action_repository_1.AdminActionRepository,
        activity_log_repository_1.ActivityLogRepository,
        admin_notification_repository_1.AdminNotificationRepository,
        mail_service_1.MailService,
        firebase_service_1.FirebaseService,
        nestjs_i18n_1.I18nService])
], AdminUserService);
//# sourceMappingURL=admin-user.service.js.map