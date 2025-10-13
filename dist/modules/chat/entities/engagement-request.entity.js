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
exports.EngagementRequest = exports.EngagementStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const conversation_entity_1 = require("./conversation.entity");
var EngagementStatus;
(function (EngagementStatus) {
    EngagementStatus["PENDING"] = "pending";
    EngagementStatus["ACCEPTED"] = "accepted";
    EngagementStatus["REFUSED"] = "refused";
    EngagementStatus["CANCELLED"] = "cancelled";
})(EngagementStatus || (exports.EngagementStatus = EngagementStatus = {}));
let EngagementRequest = class EngagementRequest {
};
exports.EngagementRequest = EngagementRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EngagementRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], EngagementRequest.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'senderId' }),
    __metadata("design:type", user_entity_1.User)
], EngagementRequest.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], EngagementRequest.prototype, "recipientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'recipientId' }),
    __metadata("design:type", user_entity_1.User)
], EngagementRequest.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], EngagementRequest.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => conversation_entity_1.Conversation, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'conversationId' }),
    __metadata("design:type", conversation_entity_1.Conversation)
], EngagementRequest.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EngagementStatus,
        default: EngagementStatus.PENDING,
    }),
    __metadata("design:type", String)
], EngagementRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], EngagementRequest.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], EngagementRequest.prototype, "respondedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EngagementRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EngagementRequest.prototype, "updatedAt", void 0);
exports.EngagementRequest = EngagementRequest = __decorate([
    (0, typeorm_1.Entity)('engagement_requests'),
    (0, typeorm_1.Index)(['senderId', 'recipientId']),
    (0, typeorm_1.Index)(['conversationId']),
    (0, typeorm_1.Index)(['status'])
], EngagementRequest);
//# sourceMappingURL=engagement-request.entity.js.map