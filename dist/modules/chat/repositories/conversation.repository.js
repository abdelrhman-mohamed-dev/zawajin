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
exports.ConversationRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const conversation_entity_1 = require("../entities/conversation.entity");
let ConversationRepository = class ConversationRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(conversation_entity_1.Conversation, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findByParticipants(userId1, userId2) {
        return this.createQueryBuilder('conversation')
            .where('(conversation.participant1Id = :userId1 AND conversation.participant2Id = :userId2) OR (conversation.participant1Id = :userId2 AND conversation.participant2Id = :userId1)', { userId1, userId2 })
            .getOne();
    }
    async findUserConversations(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.participant1', 'participant1')
            .leftJoinAndSelect('conversation.participant2', 'participant2')
            .where('conversation.participant1Id = :userId OR conversation.participant2Id = :userId', { userId })
            .orderBy('conversation.lastMessageAt', 'DESC', 'NULLS LAST')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
    }
    async updateLastMessage(conversationId, messagePreview, messageDate) {
        await this.update(conversationId, {
            lastMessagePreview: messagePreview,
            lastMessageAt: messageDate,
        });
    }
};
exports.ConversationRepository = ConversationRepository;
exports.ConversationRepository = ConversationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ConversationRepository);
//# sourceMappingURL=conversation.repository.js.map