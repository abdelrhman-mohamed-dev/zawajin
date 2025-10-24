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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("../services/chat.service");
const user_presence_repository_1 = require("../repositories/user-presence.repository");
const send_engagement_dto_1 = require("../dto/send-engagement.dto");
const ws_jwt_guard_1 = require("../guards/ws-jwt.guard");
let ChatGateway = class ChatGateway {
    constructor(chatService, userPresenceRepository, jwtService) {
        this.chatService = chatService;
        this.userPresenceRepository = userPresenceRepository;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger('ChatGateway');
        this.typingUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = this.extractTokenFromHandshake(client);
            if (!token) {
                this.logger.warn(`Client ${client.id} connected without token`);
                client.disconnect();
                return;
            }
            let payload;
            try {
                payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                });
            }
            catch (error) {
                this.logger.warn(`Client ${client.id} has invalid token: ${error.message}`);
                client.disconnect();
                return;
            }
            const userId = payload.sub;
            client.data.userId = userId;
            client.data.email = payload.email;
            this.logger.log(`Client connected: ${client.id}, User: ${userId}`);
            await this.userPresenceRepository.setUserOnline(userId, client.id);
            client.join(`user:${userId}`);
            this.broadcastUserStatusChange(userId, true);
            this.server.emit('user_online', { userId, timestamp: new Date().toISOString() });
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }
    extractTokenFromHandshake(client) {
        const authHeader = client.handshake.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        const token = client.handshake.auth?.token || client.handshake.query?.token;
        if (token && typeof token === 'string') {
            return token;
        }
        return null;
    }
    async handleDisconnect(client) {
        try {
            const userId = client.data.userId;
            if (userId) {
                this.logger.log(`Client disconnected: ${client.id}, User: ${userId}`);
                await this.userPresenceRepository.setUserOffline(userId);
                this.broadcastUserStatusChange(userId, false);
                this.server.emit('user_offline', { userId, timestamp: new Date().toISOString() });
                this.typingUsers.delete(client.id);
            }
        }
        catch (error) {
            this.logger.error(`Disconnect error: ${error.message}`);
        }
    }
    async handleJoinConversation(client, data) {
        try {
            const userId = client.data.userId;
            const { conversationId } = data;
            await this.chatService.getConversationById(userId, conversationId);
            client.join(`conversation:${conversationId}`);
            this.logger.log(`User ${userId} joined conversation ${conversationId}`);
            return { success: true, conversationId };
        }
        catch (error) {
            this.logger.error(`Join conversation error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async handleLeaveConversation(client, data) {
        try {
            const { conversationId } = data;
            client.leave(`conversation:${conversationId}`);
            this.logger.log(`User ${client.data.userId} left conversation ${conversationId}`);
            return { success: true, conversationId };
        }
        catch (error) {
            this.logger.error(`Leave conversation error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async handleSendMessage(client, data) {
        try {
            const userId = client.data.userId;
            const { conversationId, message } = data;
            const savedMessage = await this.chatService.sendMessage(userId, conversationId, message);
            const conversation = await this.chatService.getConversationById(userId, conversationId);
            const recipientId = conversation.getOtherParticipantId(userId);
            this.server.to(`conversation:${conversationId}`).emit('message_received', {
                message: savedMessage,
                conversationId,
            });
            client.emit('message_delivered', {
                messageId: savedMessage.id,
                conversationId,
            });
            const recipientPresence = await this.userPresenceRepository.getUserPresence(recipientId);
            if (!recipientPresence?.isOnline) {
                this.logger.log(`Recipient ${recipientId} is offline, should send push notification`);
            }
            return { success: true, message: savedMessage };
        }
        catch (error) {
            this.logger.error(`Send message error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async handleTypingStart(client, data) {
        try {
            const userId = client.data.userId;
            const { conversationId } = data;
            if (this.typingUsers.has(client.id)) {
                clearTimeout(this.typingUsers.get(client.id));
            }
            client.to(`conversation:${conversationId}`).emit('user_typing', {
                userId,
                conversationId,
                isTyping: true,
            });
            const timeout = setTimeout(() => {
                client.to(`conversation:${conversationId}`).emit('user_typing', {
                    userId,
                    conversationId,
                    isTyping: false,
                });
                this.typingUsers.delete(client.id);
            }, parseInt(process.env.TYPING_TIMEOUT || '5000'));
            this.typingUsers.set(client.id, timeout);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Typing start error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async handleTypingStop(client, data) {
        try {
            const userId = client.data.userId;
            const { conversationId } = data;
            if (this.typingUsers.has(client.id)) {
                clearTimeout(this.typingUsers.get(client.id));
                this.typingUsers.delete(client.id);
            }
            client.to(`conversation:${conversationId}`).emit('user_typing', {
                userId,
                conversationId,
                isTyping: false,
            });
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Typing stop error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async handleMessageRead(client, data) {
        try {
            const userId = client.data.userId;
            const { conversationId } = data;
            await this.chatService.markMessagesAsRead(userId, conversationId);
            const conversation = await this.chatService.getConversationById(userId, conversationId);
            const senderId = conversation.getOtherParticipantId(userId);
            this.server.to(`user:${senderId}`).emit('message_read', {
                conversationId,
                readBy: userId,
            });
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Message read error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    broadcastNotification(userId, notification) {
        this.server.to(`user:${userId}`).emit('notification_received', {
            ...notification,
            timestamp: notification.timestamp || new Date().toISOString(),
        });
        this.logger.log(`Notification sent to user ${userId}: ${notification.type}`);
    }
    broadcastUserStatusChange(userId, isOnline) {
        this.server.emit('user_status_changed', {
            userId,
            isOnline,
            timestamp: new Date().toISOString(),
        });
        this.logger.log(`User ${userId} status broadcasted: ${isOnline ? 'online' : 'offline'}`);
    }
    async handleSendEngagementRequest(client, data) {
        try {
            const userId = client.data.userId;
            const engagementRequest = await this.chatService.sendEngagementRequest(userId, data);
            this.server.to(`user:${data.recipientId}`).emit('engagement_request_received', {
                request: engagementRequest,
            });
            client.emit('engagement_request_sent', {
                request: engagementRequest,
            });
            this.logger.log(`Engagement request sent from ${userId} to ${data.recipientId}`);
            return { success: true, request: engagementRequest };
        }
        catch (error) {
            this.logger.error(`Send engagement request error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async handleRespondEngagementRequest(client, data) {
        try {
            const userId = client.data.userId;
            const { requestId, response } = data;
            const updatedRequest = await this.chatService.respondToEngagementRequest(userId, requestId, response);
            this.server.to(`user:${updatedRequest.senderId}`).emit('engagement_request_responded', {
                request: updatedRequest,
                status: response.status,
            });
            client.emit('engagement_response_sent', {
                request: updatedRequest,
                status: response.status,
            });
            this.logger.log(`Engagement request ${requestId} responded by ${userId} with status ${response.status}`);
            return { success: true, request: updatedRequest };
        }
        catch (error) {
            this.logger.error(`Respond engagement request error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async handleCancelEngagementRequest(client, data) {
        try {
            const userId = client.data.userId;
            const { requestId, recipientId } = data;
            await this.chatService.cancelEngagementRequest(userId, requestId);
            this.server.to(`user:${recipientId}`).emit('engagement_request_cancelled', {
                requestId,
                senderId: userId,
            });
            client.emit('engagement_request_cancel_confirmed', {
                requestId,
            });
            this.logger.log(`Engagement request ${requestId} cancelled by ${userId}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Cancel engagement request error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('leave_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('typing_start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('typing_stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingStop", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('message_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageRead", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('send_engagement_request'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        send_engagement_dto_1.SendEngagementDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendEngagementRequest", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('respond_engagement_request'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRespondEngagementRequest", null);
__decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    (0, websockets_1.SubscribeMessage)('cancel_engagement_request'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleCancelEngagementRequest", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.SOCKET_IO_CORS_ORIGIN || '*',
            credentials: true,
        },
        path: process.env.SOCKET_IO_PATH || '/socket.io',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        user_presence_repository_1.UserPresenceRepository,
        jwt_1.JwtService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map