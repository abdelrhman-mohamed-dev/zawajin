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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_repository_1 = require("../repositories/conversation.repository");
const message_repository_1 = require("../repositories/message.repository");
const user_presence_repository_1 = require("../repositories/user-presence.repository");
const engagement_request_repository_1 = require("../repositories/engagement-request.repository");
const message_entity_1 = require("../entities/message.entity");
const engagement_request_entity_1 = require("../entities/engagement-request.entity");
const like_entity_1 = require("../../interactions/entities/like.entity");
const block_entity_1 = require("../../interactions/entities/block.entity");
let ChatService = class ChatService {
    constructor(conversationRepository, messageRepository, userPresenceRepository, engagementRequestRepository, likeRepository, blockRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userPresenceRepository = userPresenceRepository;
        this.engagementRequestRepository = engagementRequestRepository;
        this.likeRepository = likeRepository;
        this.blockRepository = blockRepository;
    }
    async createConversation(userId, createConversationDto) {
        const { recipientId } = createConversationDto;
        if (userId === recipientId) {
            throw new common_1.BadRequestException({
                message: 'Cannot create conversation with yourself',
                messageAr: 'لا يمكن إنشاء محادثة مع نفسك',
            });
        }
        const isBlocked = await this.blockRepository.findOne({
            where: [
                { blockerId: userId, blockedId: recipientId },
                { blockerId: recipientId, blockedId: userId },
            ],
        });
        if (isBlocked) {
            throw new common_1.ForbiddenException({
                message: 'Cannot create conversation with blocked user',
                messageAr: 'لا يمكن إنشاء محادثة مع مستخدم محظور',
            });
        }
        const mutualLike = await this.checkMutualLike(userId, recipientId);
        if (!mutualLike) {
            throw new common_1.ForbiddenException({
                message: 'You can only chat with matched users',
                messageAr: 'يمكنك فقط الدردشة مع المستخدمين المتطابقين',
            });
        }
        const existingConversation = await this.conversationRepository.findByParticipants(userId, recipientId);
        if (existingConversation) {
            return existingConversation;
        }
        const conversation = this.conversationRepository.create({
            participant1Id: userId,
            participant2Id: recipientId,
            matchId: mutualLike.id,
        });
        return this.conversationRepository.save(conversation);
    }
    async getUserConversations(userId, page = 1, limit = 20) {
        const [conversations, total] = await this.conversationRepository.findUserConversations(userId, page, limit);
        return {
            conversations,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getConversationById(userId, conversationId) {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['participant1', 'participant2'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException({
                message: 'Conversation not found',
                messageAr: 'المحادثة غير موجودة',
            });
        }
        if (!conversation.isParticipant(userId)) {
            throw new common_1.ForbiddenException({
                message: 'You are not a participant in this conversation',
                messageAr: 'أنت لست مشاركًا في هذه المحادثة',
            });
        }
        return conversation;
    }
    async getConversationMessages(userId, conversationId, page = 1, limit = 50) {
        await this.getConversationById(userId, conversationId);
        const [messages, total] = await this.messageRepository.findByConversationId(conversationId, page, limit);
        const messageIds = messages
            .filter((m) => m.senderId !== userId && m.status === message_entity_1.MessageStatus.SENT)
            .map((m) => m.id);
        if (messageIds.length > 0) {
            await this.messageRepository.markAsDelivered(messageIds);
        }
        return {
            messages: messages.reverse(),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async sendMessage(userId, conversationId, sendMessageDto) {
        const conversation = await this.getConversationById(userId, conversationId);
        const recipientId = conversation.getOtherParticipantId(userId);
        const isBlocked = await this.blockRepository.findOne({
            where: [
                { blockerId: userId, blockedId: recipientId },
                { blockerId: recipientId, blockedId: userId },
            ],
        });
        if (isBlocked) {
            throw new common_1.ForbiddenException({
                message: 'Cannot send message to blocked user',
                messageAr: 'لا يمكن إرسال رسالة إلى مستخدم محظور',
            });
        }
        const message = this.messageRepository.create({
            conversationId,
            senderId: userId,
            content: sendMessageDto.content,
            messageType: sendMessageDto.messageType || message_entity_1.MessageType.TEXT,
            fileUrl: sendMessageDto.fileUrl || null,
            audioDuration: sendMessageDto.audioDuration || null,
            status: message_entity_1.MessageStatus.SENT,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedMessage = await this.messageRepository.save(message);
        console.log('Message saved with timestamp:', savedMessage.createdAt);
        console.log('Current server time:', new Date().toISOString());
        const preview = sendMessageDto.content.length > 100
            ? sendMessageDto.content.substring(0, 100) + '...'
            : sendMessageDto.content;
        await this.conversationRepository.updateLastMessage(conversationId, preview, savedMessage.createdAt);
        return savedMessage;
    }
    async markMessagesAsRead(userId, conversationId) {
        await this.getConversationById(userId, conversationId);
        const unreadMessages = await this.messageRepository
            .createQueryBuilder('message')
            .where('message.conversationId = :conversationId', { conversationId })
            .andWhere('message.senderId != :userId', { userId })
            .andWhere('message.status != :status', { status: message_entity_1.MessageStatus.READ })
            .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
            .getMany();
        if (unreadMessages.length > 0) {
            const messageIds = unreadMessages.map((m) => m.id);
            await this.messageRepository.markAsRead(messageIds);
        }
    }
    async deleteMessage(userId, messageId) {
        const message = await this.messageRepository.findOne({
            where: { id: messageId },
        });
        if (!message) {
            throw new common_1.NotFoundException({
                message: 'Message not found',
                messageAr: 'الرسالة غير موجودة',
            });
        }
        if (message.senderId !== userId) {
            throw new common_1.ForbiddenException({
                message: 'You can only delete your own messages',
                messageAr: 'يمكنك فقط حذف رسائلك الخاصة',
            });
        }
        await this.messageRepository.softDeleteMessage(messageId);
    }
    async deleteConversation(userId, conversationId) {
        const conversation = await this.getConversationById(userId, conversationId);
        await this.messageRepository.delete({ conversationId });
        await this.conversationRepository.update({ id: conversationId }, {
            lastMessagePreview: null,
            lastMessageAt: null,
        });
    }
    async getUnreadCount(userId, conversationId) {
        await this.getConversationById(userId, conversationId);
        return this.messageRepository.getUnreadCount(conversationId, userId);
    }
    async getUserPresence(userId) {
        const presence = await this.userPresenceRepository.getUserPresence(userId);
        if (!presence) {
            return {
                userId,
                isOnline: false,
                lastSeenAt: null,
            };
        }
        return {
            userId: presence.userId,
            isOnline: presence.isOnline,
            lastSeenAt: presence.lastSeenAt,
        };
    }
    async checkMutualLike(userId1, userId2) {
        const like1 = await this.likeRepository.findOne({
            where: { userId: userId1, likedUserId: userId2 },
        });
        const like2 = await this.likeRepository.findOne({
            where: { userId: userId2, likedUserId: userId1 },
        });
        return like1 && like2 ? like1 : null;
    }
    async sendEngagementRequest(userId, sendEngagementDto) {
        const { recipientId, conversationId, message } = sendEngagementDto;
        if (userId === recipientId) {
            throw new common_1.BadRequestException({
                message: 'Cannot send engagement request to yourself',
                messageAr: 'لا يمكن إرسال طلب خطوبة لنفسك',
            });
        }
        const conversation = await this.getConversationById(userId, conversationId);
        const otherParticipantId = conversation.getOtherParticipantId(userId);
        if (otherParticipantId !== recipientId) {
            throw new common_1.BadRequestException({
                message: 'Recipient must be the other participant in the conversation',
                messageAr: 'يجب أن يكون المستلم هو المشارك الآخر في المحادثة',
            });
        }
        const isBlocked = await this.blockRepository.findOne({
            where: [
                { blockerId: userId, blockedId: recipientId },
                { blockerId: recipientId, blockedId: userId },
            ],
        });
        if (isBlocked) {
            throw new common_1.ForbiddenException({
                message: 'Cannot send engagement request to blocked user',
                messageAr: 'لا يمكن إرسال طلب خطوبة إلى مستخدم محظور',
            });
        }
        const existingRequest = await this.engagementRequestRepository.findPendingRequestBetweenUsers(userId, recipientId);
        if (existingRequest) {
            throw new common_1.ConflictException({
                message: 'You already have a pending engagement request with this user',
                messageAr: 'لديك بالفعل طلب خطوبة معلق مع هذا المستخدم',
            });
        }
        const recipientRequest = await this.engagementRequestRepository.findPendingRequestBetweenUsers(recipientId, userId);
        if (recipientRequest) {
            throw new common_1.ConflictException({
                message: 'This user has already sent you an engagement request',
                messageAr: 'أرسل لك هذا المستخدم بالفعل طلب خطوبة',
            });
        }
        const engagementRequest = this.engagementRequestRepository.create({
            senderId: userId,
            recipientId,
            conversationId,
            message,
            status: engagement_request_entity_1.EngagementStatus.PENDING,
        });
        return this.engagementRequestRepository.save(engagementRequest);
    }
    async respondToEngagementRequest(userId, requestId, respondDto) {
        const request = await this.engagementRequestRepository.findRequestById(requestId, userId);
        if (!request) {
            throw new common_1.NotFoundException({
                message: 'Engagement request not found',
                messageAr: 'طلب الخطوبة غير موجود',
            });
        }
        if (request.recipientId !== userId) {
            throw new common_1.ForbiddenException({
                message: 'Only the recipient can respond to this request',
                messageAr: 'يمكن للمستلم فقط الرد على هذا الطلب',
            });
        }
        if (request.status !== engagement_request_entity_1.EngagementStatus.PENDING) {
            throw new common_1.BadRequestException({
                message: 'This engagement request has already been responded to',
                messageAr: 'تم الرد على طلب الخطوبة هذا بالفعل',
            });
        }
        request.status = respondDto.status;
        request.respondedAt = new Date();
        return this.engagementRequestRepository.save(request);
    }
    async cancelEngagementRequest(userId, requestId) {
        const request = await this.engagementRequestRepository.findRequestById(requestId, userId);
        if (!request) {
            throw new common_1.NotFoundException({
                message: 'Engagement request not found',
                messageAr: 'طلب الخطوبة غير موجود',
            });
        }
        if (request.senderId !== userId) {
            throw new common_1.ForbiddenException({
                message: 'Only the sender can cancel this request',
                messageAr: 'يمكن للمرسل فقط إلغاء هذا الطلب',
            });
        }
        if (request.status !== engagement_request_entity_1.EngagementStatus.PENDING) {
            throw new common_1.BadRequestException({
                message: 'Can only cancel pending engagement requests',
                messageAr: 'يمكن فقط إلغاء طلبات الخطوبة المعلقة',
            });
        }
        request.status = engagement_request_entity_1.EngagementStatus.CANCELLED;
        await this.engagementRequestRepository.save(request);
    }
    async getSentEngagementRequests(userId, page = 1, limit = 20) {
        const [requests, total] = await this.engagementRequestRepository.findUserSentRequests(userId, page, limit);
        return {
            requests,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getReceivedEngagementRequests(userId, page = 1, limit = 20) {
        const [requests, total] = await this.engagementRequestRepository.findUserReceivedRequests(userId, page, limit);
        return {
            requests,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getPendingEngagementRequests(userId) {
        return this.engagementRequestRepository.findPendingReceivedRequests(userId);
    }
    async getEngagementRequestById(userId, requestId) {
        const request = await this.engagementRequestRepository.findRequestById(requestId, userId);
        if (!request) {
            throw new common_1.NotFoundException({
                message: 'Engagement request not found',
                messageAr: 'طلب الخطوبة غير موجود',
            });
        }
        return request;
    }
    async getConversationEngagementRequests(userId, conversationId) {
        await this.getConversationById(userId, conversationId);
        return this.engagementRequestRepository.findByConversation(conversationId);
    }
    async getPendingEngagementCount(userId) {
        return this.engagementRequestRepository.countPendingReceivedRequests(userId);
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(5, (0, typeorm_1.InjectRepository)(block_entity_1.Block)),
    __metadata("design:paramtypes", [conversation_repository_1.ConversationRepository,
        message_repository_1.MessageRepository,
        user_presence_repository_1.UserPresenceRepository,
        engagement_request_repository_1.EngagementRequestRepository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
//# sourceMappingURL=chat.service.js.map