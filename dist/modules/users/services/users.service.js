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
const user_presence_repository_1 = require("../../chat/repositories/user-presence.repository");
const chat_gateway_1 = require("../../chat/gateways/chat.gateway");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, likeRepository, userPresenceRepository, chatGateway) {
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.userPresenceRepository = userPresenceRepository;
        this.chatGateway = chatGateway;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    sanitizeNumericFields(user) {
        const numericFields = [
            'age', 'numberOfChildren', 'weight', 'height',
            'preferredAgeFrom', 'preferredAgeTo',
            'preferredMinWeight', 'preferredMaxWeight',
            'preferredMinHeight', 'preferredMaxHeight'
        ];
        const sanitized = { ...user };
        numericFields.forEach(field => {
            if (sanitized[field] !== null && sanitized[field] !== undefined) {
                sanitized[field] = Math.round(Number(sanitized[field]));
            }
        });
        return sanitized;
    }
    async validateProfileByGender(userId, profileData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        const gender = user.gender.toLowerCase();
        const maleMaritalStatuses = ['single', 'divorced', 'widowed', 'married'];
        const femaleMaritalStatuses = [
            'f_single',
            'f_divorced',
            'f_widowed',
            'virgin',
            'widow',
        ];
        const maleHealthStatuses = ['healthy', 'chronically_ill', 'disabled'];
        const femaleHealthStatuses = [
            'f_healthy',
            'f_chronically_ill',
            'f_disabled',
        ];
        const maleReligiosityLevels = ['normal', 'conservative', 'committed'];
        const femaleReligiosityLevels = [
            'f_normal',
            'f_conservative',
            'f_committed',
        ];
        const maleEmploymentTypes = ['unemployed', 'employed', 'self_employed'];
        const femaleEmploymentTypes = [
            'f_unemployed',
            'f_employed',
            'self_employed',
        ];
        const maleBeautyValues = ['acceptable', 'average', 'handsome'];
        const femaleBeautyValues = [
            'f_acceptable',
            'f_average',
            'f_beautiful',
            'f_very_beautiful',
            'beautiful',
            'very_beautiful',
        ];
        if (gender === 'male') {
            if (profileData.acceptPolygamy !== undefined && profileData.acceptPolygamy !== null) {
                throw new common_1.BadRequestException('Male users cannot have acceptPolygamy field. Use polygamyStatus instead.');
            }
            if (profileData.maritalStatus &&
                !maleMaritalStatuses.includes(profileData.maritalStatus)) {
                throw new common_1.BadRequestException(`Invalid marital status for male users. Must be one of: ${maleMaritalStatuses.join(', ')}`);
            }
            if (profileData.healthStatus &&
                !maleHealthStatuses.includes(profileData.healthStatus)) {
                throw new common_1.BadRequestException(`Invalid health status for male users. Must be one of: ${maleHealthStatuses.join(', ')}`);
            }
            if (profileData.religiosityLevel &&
                !maleReligiosityLevels.includes(profileData.religiosityLevel)) {
                throw new common_1.BadRequestException(`Invalid religiosity level for male users. Must be one of: ${maleReligiosityLevels.join(', ')}`);
            }
            if (profileData.natureOfWork &&
                !maleEmploymentTypes.includes(profileData.natureOfWork)) {
                throw new common_1.BadRequestException(`Invalid employment type for male users. Must be one of: ${maleEmploymentTypes.join(', ')}`);
            }
            if (profileData.beauty && !maleBeautyValues.includes(profileData.beauty)) {
                throw new common_1.BadRequestException(`Invalid beauty value for male users. Must be one of: ${maleBeautyValues.join(', ')}`);
            }
        }
        if (gender === 'female') {
            if (profileData.polygamyStatus !== undefined &&
                profileData.polygamyStatus !== null &&
                typeof profileData.polygamyStatus === 'string') {
                throw new common_1.BadRequestException('Female users cannot have polygamyStatus field. Use acceptPolygamy (boolean) instead.');
            }
            if (profileData.maritalStatus &&
                !femaleMaritalStatuses.includes(profileData.maritalStatus)) {
                throw new common_1.BadRequestException(`Invalid marital status for female users. Must be one of: ${femaleMaritalStatuses.join(', ')}`);
            }
            if (profileData.healthStatus &&
                !femaleHealthStatuses.includes(profileData.healthStatus)) {
                throw new common_1.BadRequestException(`Invalid health status for female users. Must be one of: ${femaleHealthStatuses.join(', ')}`);
            }
            if (profileData.religiosityLevel &&
                !femaleReligiosityLevels.includes(profileData.religiosityLevel)) {
                throw new common_1.BadRequestException(`Invalid religiosity level for female users. Must be one of: ${femaleReligiosityLevels.join(', ')}`);
            }
            if (profileData.natureOfWork &&
                !femaleEmploymentTypes.includes(profileData.natureOfWork)) {
                throw new common_1.BadRequestException(`Invalid employment type for female users. Must be one of: ${femaleEmploymentTypes.join(', ')}`);
            }
            if (profileData.beauty &&
                !femaleBeautyValues.includes(profileData.beauty)) {
                throw new common_1.BadRequestException(`Invalid beauty value for female users. Must be one of: ${femaleBeautyValues.join(', ')}`);
            }
        }
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
        return this.sanitizeNumericFields(updatedUser);
    }
    async getAllUsers(queryDto, currentUserId) {
        this.logger.log(`Fetching users with filters: ${JSON.stringify(queryDto)}`);
        const result = await this.userRepository.findAllUsers(queryDto);
        const userIds = result.users.map(user => user.id);
        const likedUserIds = currentUserId
            ? await this.checkLikeStatus(currentUserId, userIds)
            : new Set();
        const presencePromises = userIds.map(id => this.userPresenceRepository.getUserPresence(id));
        const presences = await Promise.all(presencePromises);
        const presenceMap = new Map(presences.map((presence, index) => [
            userIds[index],
            { isOnline: presence ? presence.isOnline : true, lastSeenAt: presence ? presence.lastSeenAt : null }
        ]));
        const usersWithLikeStatus = result.users.map((user) => {
            const { passwordHash, ...userWithoutPassword } = user;
            const presenceData = presenceMap.get(user.id);
            return this.sanitizeNumericFields({
                ...userWithoutPassword,
                hasLiked: likedUserIds.has(user.id),
                isOnline: presenceData?.isOnline ?? true,
                lastSeenAt: presenceData?.lastSeenAt ?? null,
            });
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
        const presence = await this.userPresenceRepository.getUserPresence(userId);
        const isOnline = presence ? presence.isOnline : true;
        const lastSeenAt = presence ? presence.lastSeenAt : null;
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
        return this.sanitizeNumericFields({
            ...user,
            isOnline,
            lastSeenAt,
            likedme,
            isliked,
            matching,
        });
    }
    async getCurrentUser(userId) {
        this.logger.log(`Fetching current user: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        delete user.passwordHash;
        return this.sanitizeNumericFields(user);
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
    async getLatestUsers(queryDto) {
        const limit = queryDto.limit || 10;
        this.logger.log(`Fetching latest ${limit} joined users with filters: ${JSON.stringify(queryDto)}`);
        const users = await this.userRepository.findLatestUsers(queryDto);
        const userIds = users.map(user => user.id);
        const presencePromises = userIds.map(id => this.userPresenceRepository.getUserPresence(id));
        const presences = await Promise.all(presencePromises);
        const presenceMap = new Map(presences.map((presence, index) => [
            userIds[index],
            { isOnline: presence ? presence.isOnline : true, lastSeenAt: presence ? presence.lastSeenAt : null }
        ]));
        const sanitizedUsers = users.map((user) => {
            const { passwordHash, fcmToken, ...userWithoutSensitiveData } = user;
            const presenceData = presenceMap.get(user.id);
            return this.sanitizeNumericFields({
                ...userWithoutSensitiveData,
                isOnline: presenceData?.isOnline ?? true,
                lastSeenAt: presenceData?.lastSeenAt ?? null,
            });
        });
        this.logger.log(`Retrieved ${sanitizedUsers.length} latest users`);
        return sanitizedUsers;
    }
    async getUserStatistics() {
        this.logger.log('Fetching user statistics');
        const stats = await this.userRepository.getUserStatistics();
        this.logger.log(`Statistics retrieved: ${JSON.stringify(stats)}`);
        return stats;
    }
    async setUserStatus(userId, isOnline) {
        this.logger.log(`Setting user status for user ${userId} to ${isOnline ? 'online' : 'offline'}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found / المستخدم غير موجود');
        }
        const presence = await this.userPresenceRepository.setUserStatus(userId, isOnline);
        this.chatGateway.broadcastUserStatusChange(userId, isOnline);
        this.logger.log(`User status updated successfully for user: ${userId} and broadcasted`);
        return presence;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        typeorm_2.Repository,
        user_presence_repository_1.UserPresenceRepository,
        chat_gateway_1.ChatGateway])
], UsersService);
//# sourceMappingURL=users.service.js.map