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
exports.EngagementRequestRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const engagement_request_entity_1 = require("../entities/engagement-request.entity");
let EngagementRequestRepository = class EngagementRequestRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(engagement_request_entity_1.EngagementRequest, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findPendingRequestBetweenUsers(senderId, recipientId) {
        return this.findOne({
            where: {
                senderId,
                recipientId,
                status: engagement_request_entity_1.EngagementStatus.PENDING,
            },
            relations: ['sender', 'recipient', 'conversation'],
        });
    }
    async findRequestById(requestId, userId) {
        return this.createQueryBuilder('request')
            .leftJoinAndSelect('request.sender', 'sender')
            .leftJoinAndSelect('request.recipient', 'recipient')
            .leftJoinAndSelect('request.conversation', 'conversation')
            .where('request.id = :requestId', { requestId })
            .andWhere('(request.senderId = :userId OR request.recipientId = :userId)', {
            userId,
        })
            .getOne();
    }
    async findUserSentRequests(userId, page = 1, limit = 20) {
        return this.findAndCount({
            where: { senderId: userId },
            relations: ['recipient', 'conversation'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async findUserReceivedRequests(userId, page = 1, limit = 20) {
        return this.findAndCount({
            where: { recipientId: userId },
            relations: ['sender', 'conversation'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async findPendingReceivedRequests(userId) {
        return this.find({
            where: {
                recipientId: userId,
                status: engagement_request_entity_1.EngagementStatus.PENDING,
            },
            relations: ['sender', 'conversation'],
            order: { createdAt: 'DESC' },
        });
    }
    async countPendingReceivedRequests(userId) {
        return this.count({
            where: {
                recipientId: userId,
                status: engagement_request_entity_1.EngagementStatus.PENDING,
            },
        });
    }
    async findByConversation(conversationId) {
        return this.find({
            where: { conversationId },
            relations: ['sender', 'recipient'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.EngagementRequestRepository = EngagementRequestRepository;
exports.EngagementRequestRepository = EngagementRequestRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EngagementRequestRepository);
//# sourceMappingURL=engagement-request.repository.js.map