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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_repository_1 = require("../../auth/repositories/user.repository");
const like_entity_1 = require("../../interactions/entities/like.entity");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, likeRepository) {
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async updateProfile(userId, profileData) {
        this.logger.log(`Updating profile for user: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        const updateData = { ...profileData };
        if (profileData.dateOfBirth) {
            const birthDate = new Date(profileData.dateOfBirth);
            updateData.dateOfBirth = birthDate;
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            updateData.age = age;
        }
        const updatedUser = await this.userRepository.updateProfile(userId, updateData);
        this.logger.log(`Profile updated successfully for user: ${userId}`);
        delete updatedUser.passwordHash;
        return updatedUser;
    }
    async getAllUsers(queryDto, currentUserId) {
        this.logger.log(`Fetching users with filters: ${JSON.stringify(queryDto)}`);
        const result = await this.userRepository.findAllUsers(queryDto);
        const userIds = result.users.map(user => user.id);
        const likedUserIds = currentUserId
            ? await this.checkLikeStatus(currentUserId, userIds)
            : new Set();
        const usersWithLikeStatus = result.users.map((user) => {
            const { passwordHash, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                hasLiked: likedUserIds.has(user.id),
            };
        });
        this.logger.log(`Retrieved ${usersWithLikeStatus.length} users out of ${result.total} total`);
        return {
            ...result,
            users: usersWithLikeStatus,
        };
    }
    async getUserById(userId, currentUserId) {
        this.logger.log(`Fetching user by ID: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        if (!user.isActive) {
            throw new common_1.NotFoundException('User account is deactivated / حساب المستخدم معطل');
        }
        if (!user.isEmailVerified) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        let likedme = false;
        let isliked = false;
        let matching = false;
        if (currentUserId) {
            const targetLikedCurrent = await this.likeRepository.findOne({
                where: { userId: userId, likedUserId: currentUserId },
            });
            likedme = !!targetLikedCurrent;
            const currentLikedTarget = await this.likeRepository.findOne({
                where: { userId: currentUserId, likedUserId: userId },
            });
            isliked = !!currentLikedTarget;
            matching = likedme && isliked;
        }
        delete user.passwordHash;
        delete user.fcmToken;
        this.logger.log(`User retrieved successfully: ${userId}`);
        return {
            ...user,
            likedme,
            isliked,
            matching,
        };
    }
    async getCurrentUser(userId) {
        this.logger.log(`Fetching current user: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        delete user.passwordHash;
        return user;
    }
    async checkLikeStatus(currentUserId, targetUserIds) {
        if (!currentUserId || targetUserIds.length === 0) {
            return new Set();
        }
        const likes = await this.likeRepository.find({
            where: { userId: currentUserId },
            select: ['likedUserId'],
        });
        return new Set(likes.map(like => like.likedUserId));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map