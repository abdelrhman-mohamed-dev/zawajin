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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const chat_service_1 = require("../services/chat.service");
const create_conversation_dto_1 = require("../dto/create-conversation.dto");
const send_message_dto_1 = require("../dto/send-message.dto");
const pagination_dto_1 = require("../dto/pagination.dto");
const throttler_1 = require("@nestjs/throttler");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createConversation(req, createConversationDto) {
        return this.chatService.createConversation(req.user.userId, createConversationDto);
    }
    async getUserConversations(req, paginationDto) {
        return this.chatService.getUserConversations(req.user.userId, paginationDto.page, paginationDto.limit);
    }
    async getConversationById(req, id) {
        return this.chatService.getConversationById(req.user.userId, id);
    }
    async getConversationMessages(req, id, paginationDto) {
        return this.chatService.getConversationMessages(req.user.userId, id, paginationDto.page, paginationDto.limit);
    }
    async sendMessage(req, id, sendMessageDto) {
        return this.chatService.sendMessage(req.user.userId, id, sendMessageDto);
    }
    async markMessagesAsRead(req, id) {
        await this.chatService.markMessagesAsRead(req.user.userId, id);
        return {
            message: 'Messages marked as read',
            messageAr: 'تم وضع علامة مقروءة على الرسائل',
        };
    }
    async deleteMessage(req, id) {
        await this.chatService.deleteMessage(req.user.userId, id);
        return {
            message: 'Message deleted successfully',
            messageAr: 'تم حذف الرسالة بنجاح',
        };
    }
    async getUnreadCount(req, id) {
        const count = await this.chatService.getUnreadCount(req.user.userId, id);
        return { count };
    }
    async getUserPresence(req, userId) {
        return this.chatService.getUserPresence(userId);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('conversations'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new conversation with a matched user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Conversation created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Users are not matched or blocked' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_conversation_dto_1.CreateConversationDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all conversations for current user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of conversations retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Conversation details retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a participant in this conversation' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversationById", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get message history for a conversation (paginated)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Messages retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversationMessages", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message to a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Message sent successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Cannot send message to blocked user' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Put)('conversations/:id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all messages in conversation as read' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Messages marked as read successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Conversation not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markMessagesAsRead", null);
__decorate([
    (0, common_1.Delete)('messages/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a message (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Message ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Message deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Can only delete own messages' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Get)('conversations/:id/unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread message count for a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Conversation ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Unread count retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)('users/:userId/presence'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user online/offline status' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User presence retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUserPresence", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map