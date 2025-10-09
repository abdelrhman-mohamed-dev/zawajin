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
exports.InteractionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_i18n_1 = require("nestjs-i18n");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const interactions_service_1 = require("../services/interactions.service");
const users_service_1 = require("../../users/services/users.service");
let InteractionsController = class InteractionsController {
    constructor(interactionsService, usersService) {
        this.interactionsService = interactionsService;
        this.usersService = usersService;
    }
    async likeUser(req, likedUserId) {
        const result = await this.interactionsService.likeUser(req.user.sub, likedUserId);
        return {
            success: true,
            message: result.message,
            data: {
                isMatch: result.isMatch,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async unlikeUser(req, likedUserId, i18n) {
        await this.interactionsService.unlikeUser(req.user.sub, likedUserId);
        return {
            success: true,
            message: await i18n.t('interactions.unlike_successful'),
            timestamp: new Date().toISOString(),
        };
    }
    async blockUser(req, blockedUserId, i18n, body) {
        await this.interactionsService.blockUser(req.user.sub, blockedUserId, body?.reason);
        return {
            success: true,
            message: await i18n.t('interactions.user_blocked'),
            timestamp: new Date().toISOString(),
        };
    }
    async unblockUser(req, blockedUserId, i18n) {
        await this.interactionsService.unblockUser(req.user.sub, blockedUserId);
        return {
            success: true,
            message: await i18n.t('interactions.user_unblocked'),
            timestamp: new Date().toISOString(),
        };
    }
    async getLikesSent(req, i18n) {
        const likes = await this.interactionsService.getLikesSent(req.user.sub);
        return {
            success: true,
            message: await i18n.t('interactions.likes_retrieved'),
            data: {
                likes,
                total: likes.length,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async getLikesReceived(req, i18n) {
        const likes = await this.interactionsService.getLikesReceived(req.user.sub);
        return {
            success: true,
            message: await i18n.t('interactions.likes_retrieved'),
            data: {
                likes,
                total: likes.length,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async getBlockedUsers(req, i18n) {
        const blocks = await this.interactionsService.getBlockedUsers(req.user.sub);
        return {
            success: true,
            message: await i18n.t('interactions.blocked_users_retrieved'),
            data: {
                blocks,
                total: blocks.length,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async getUserById(id, i18n) {
        const user = await this.usersService.getUserById(id);
        return {
            success: true,
            message: await i18n.t('interactions.user_retrieved'),
            data: user,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.InteractionsController = InteractionsController;
__decorate([
    (0, common_1.Post)(':id/like'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Like a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID to like' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Like sent successfully',
        schema: {
            example: {
                success: true,
                message: 'Like sent successfully',
                data: {
                    isMatch: false,
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'It\'s a match!',
        schema: {
            example: {
                success: true,
                message: 'It\'s a match!',
                data: {
                    isMatch: true,
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Already liked this user' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "likeUser", null);
__decorate([
    (0, common_1.Delete)(':id/like'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Unlike a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID to unlike' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Unlike successful',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Like not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "unlikeUser", null);
__decorate([
    (0, common_1.Post)(':id/block'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Block a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID to block' }),
    (0, swagger_1.ApiBody)({
        required: false,
        schema: {
            type: 'object',
            properties: {
                reason: {
                    type: 'string',
                    example: 'Inappropriate behavior',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User blocked successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Already blocked this user' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, nestjs_i18n_1.I18n)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, nestjs_i18n_1.I18nContext, Object]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Delete)(':id/block'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Unblock a user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID to unblock' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User unblocked successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Block not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Get)('likes/sent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likes sent by current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Likes retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "getLikesSent", null);
__decorate([
    (0, common_1.Get)('likes/received'),
    (0, swagger_1.ApiOperation)({ summary: 'Get likes received by current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Likes retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "getLikesReceived", null);
__decorate([
    (0, common_1.Get)('blocks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blocked users' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Blocked users retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "getBlockedUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'User ID',
        example: '615c8a9b4f7d4e3e4c8b4567',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "getUserById", null);
exports.InteractionsController = InteractionsController = __decorate([
    (0, swagger_1.ApiTags)('User Interactions'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [interactions_service_1.InteractionsService,
        users_service_1.UsersService])
], InteractionsController);
//# sourceMappingURL=interactions.controller.js.map