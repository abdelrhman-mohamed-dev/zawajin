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
var InteractionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsService = void 0;
const common_1 = require("@nestjs/common");
const like_repository_1 = require("../repositories/like.repository");
const block_repository_1 = require("../repositories/block.repository");
const profile_visit_repository_1 = require("../repositories/profile-visit.repository");
const user_repository_1 = require("../../auth/repositories/user.repository");
let InteractionsService = InteractionsService_1 = class InteractionsService {
    constructor(likeRepository, blockRepository, profileVisitRepository, userRepository) {
        this.likeRepository = likeRepository;
        this.blockRepository = blockRepository;
        this.profileVisitRepository = profileVisitRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(InteractionsService_1.name);
    }
    async likeUser(userId, likedUserId) {
        this.logger.log(`User ${userId} attempting to like user ${likedUserId}`);
        if (userId === likedUserId) {
            throw new common_1.BadRequestException('You cannot like yourself / لا يمكنك الإعجاب بنفسك');
        }
        const targetUser = await this.userRepository.findById(likedUserId);
        if (!targetUser || !targetUser.isActive || !targetUser.isEmailVerified) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        const isBlocked = await this.blockRepository.isBlockedByEither(userId, likedUserId);
        if (isBlocked) {
            throw new common_1.BadRequestException('Cannot like this user / لا يمكن الإعجاب بهذا المستخدم');
        }
        const existingLike = await this.likeRepository.findByUserAndLikedUser(userId, likedUserId);
        if (existingLike) {
            throw new common_1.ConflictException('You already liked this user / لقد أعجبت بهذا المستخدم بالفعل');
        }
        await this.likeRepository.create(userId, likedUserId);
        const isMatch = await this.likeRepository.checkMutualLike(userId, likedUserId);
        this.logger.log(`User ${userId} liked user ${likedUserId}. Match: ${isMatch}`);
        return {
            message: isMatch
                ? 'It\'s a match! / إنه تطابق!'
                : 'Like sent successfully / تم إرسال الإعجاب بنجاح',
            isMatch,
        };
    }
    async unlikeUser(userId, likedUserId) {
        this.logger.log(`User ${userId} attempting to unlike user ${likedUserId}`);
        const existingLike = await this.likeRepository.findByUserAndLikedUser(userId, likedUserId);
        if (!existingLike) {
            throw new common_1.NotFoundException('Like not found / الإعجاب غير موجود');
        }
        await this.likeRepository.delete(userId, likedUserId);
        this.logger.log(`User ${userId} unliked user ${likedUserId}`);
    }
    async blockUser(userId, blockedUserId, reason) {
        this.logger.log(`User ${userId} attempting to block user ${blockedUserId}`);
        if (userId === blockedUserId) {
            throw new common_1.BadRequestException('You cannot block yourself / لا يمكنك حظر نفسك');
        }
        const targetUser = await this.userRepository.findById(blockedUserId);
        if (!targetUser) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        const existingBlock = await this.blockRepository.findByBlockerAndBlocked(userId, blockedUserId);
        if (existingBlock) {
            throw new common_1.ConflictException('You already blocked this user / لقد قمت بحظر هذا المستخدم بالفعل');
        }
        await this.blockRepository.create(userId, blockedUserId, reason);
        await this.likeRepository.delete(userId, blockedUserId);
        await this.likeRepository.delete(blockedUserId, userId);
        this.logger.log(`User ${userId} blocked user ${blockedUserId}`);
    }
    async unblockUser(userId, blockedUserId) {
        this.logger.log(`User ${userId} attempting to unblock user ${blockedUserId}`);
        const existingBlock = await this.blockRepository.findByBlockerAndBlocked(userId, blockedUserId);
        if (!existingBlock) {
            throw new common_1.NotFoundException('Block not found / الحظر غير موجود');
        }
        await this.blockRepository.delete(userId, blockedUserId);
        this.logger.log(`User ${userId} unblocked user ${blockedUserId}`);
    }
    async getLikesSent(userId) {
        this.logger.log(`Getting likes sent by user ${userId}`);
        const likes = await this.likeRepository.findLikesSentByUser(userId);
        return likes.map((like) => {
            const { passwordHash, fcmToken, ...userData } = like.likedUser;
            return {
                id: like.id,
                likedUser: userData,
                createdAt: like.createdAt,
            };
        });
    }
    async getLikesReceived(userId) {
        this.logger.log(`Getting likes received by user ${userId}`);
        const likes = await this.likeRepository.findLikesReceivedByUser(userId);
        return likes.map((like) => {
            const { passwordHash, fcmToken, ...userData } = like.user;
            return {
                id: like.id,
                user: userData,
                createdAt: like.createdAt,
            };
        });
    }
    async getBlockedUsers(userId) {
        this.logger.log(`Getting blocked users for user ${userId}`);
        const blocks = await this.blockRepository.findBlocksByUser(userId);
        return blocks.map((block) => ({
            id: block.id,
            blockedUser: {
                id: block.blocked.id,
                fullName: block.blocked.fullName,
                chartNumber: block.blocked.chartNumber,
            },
            reason: block.reason,
            createdAt: block.createdAt,
        }));
    }
    async recordProfileVisit(visitorId, profileOwnerId) {
        this.logger.log(`User ${visitorId} visiting profile of user ${profileOwnerId}`);
        if (visitorId === profileOwnerId) {
            return;
        }
        const profileOwner = await this.userRepository.findById(profileOwnerId);
        if (!profileOwner || !profileOwner.isActive || !profileOwner.isEmailVerified) {
            throw new common_1.NotFoundException('Profile not found / الملف الشخصي غير موجود');
        }
        await this.profileVisitRepository.create(visitorId, profileOwnerId);
        this.logger.log(`Profile visit recorded: visitor ${visitorId} -> profile owner ${profileOwnerId}`);
    }
    async getProfileVisitStats(userId) {
        this.logger.log(`Getting profile visit stats for user ${userId}`);
        const stats = await this.profileVisitRepository.getVisitorStats(userId);
        return stats;
    }
    async getRecentVisitors(userId, limit = 10) {
        this.logger.log(`Getting recent visitors for user ${userId}`);
        const visits = await this.profileVisitRepository.findRecentVisitors(userId, limit);
        return visits.map((visit) => ({
            visitorId: visit.visitorId,
            chartNumber: visit.visitor.chartNumber,
            fullName: visit.visitor.fullName,
            visitedAt: visit.createdAt,
        }));
    }
};
exports.InteractionsService = InteractionsService;
exports.InteractionsService = InteractionsService = InteractionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [like_repository_1.LikeRepository,
        block_repository_1.BlockRepository,
        profile_visit_repository_1.ProfileVisitRepository,
        user_repository_1.UserRepository])
], InteractionsService);
//# sourceMappingURL=interactions.service.js.map