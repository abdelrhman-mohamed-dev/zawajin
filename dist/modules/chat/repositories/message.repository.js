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
exports.MessageRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const message_entity_1 = require("../entities/message.entity");
let MessageRepository = class MessageRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(message_entity_1.Message, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findByConversationId(conversationId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        return this.createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .where('message.conversationId = :conversationId', { conversationId })
            .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
            .orderBy('message.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
    }
    async markAsDelivered(messageIds) {
        await this.createQueryBuilder()
            .update(message_entity_1.Message)
            .set({ status: message_entity_1.MessageStatus.DELIVERED })
            .where('id IN (:...messageIds)', { messageIds })
            .andWhere('status = :status', { status: message_entity_1.MessageStatus.SENT })
            .execute();
    }
    async markAsRead(messageIds) {
        await this.createQueryBuilder()
            .update(message_entity_1.Message)
            .set({
            status: message_entity_1.MessageStatus.READ,
            readAt: new Date(),
        })
            .where('id IN (:...messageIds)', { messageIds })
            .andWhere('status != :status', { status: message_entity_1.MessageStatus.READ })
            .execute();
    }
    async getUnreadCount(conversationId, userId) {
        return this.createQueryBuilder('message')
            .where('message.conversationId = :conversationId', { conversationId })
            .andWhere('message.senderId != :userId', { userId })
            .andWhere('message.status != :status', { status: message_entity_1.MessageStatus.READ })
            .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
            .getCount();
    }
    async softDeleteMessage(messageId) {
        await this.update(messageId, {
            isDeleted: true,
            deletedAt: new Date(),
        });
    }
};
exports.MessageRepository = MessageRepository;
exports.MessageRepository = MessageRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MessageRepository);
//# sourceMappingURL=message.repository.js.map