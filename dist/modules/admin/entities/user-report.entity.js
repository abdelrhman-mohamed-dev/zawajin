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
exports.UserReport = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const conversation_entity_1 = require("../../chat/entities/conversation.entity");
let UserReport = class UserReport {
};
exports.UserReport = UserReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'reporter_id' }),
    __metadata("design:type", String)
], UserReport.prototype, "reporterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'reporter_id' }),
    __metadata("design:type", user_entity_1.User)
], UserReport.prototype, "reporter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'reported_user_id' }),
    __metadata("design:type", String)
], UserReport.prototype, "reportedUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'reported_user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserReport.prototype, "reportedUser", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: [
            'inappropriate_content',
            'fake_profile',
            'harassment',
            'spam',
            'fraud',
            'other',
        ],
        name: 'report_type',
    }),
    __metadata("design:type", String)
], UserReport.prototype, "reportType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], UserReport.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Screenshots, message IDs, and other evidence',
    }),
    __metadata("design:type", Object)
], UserReport.prototype, "evidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'conversation_id' }),
    __metadata("design:type", String)
], UserReport.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => conversation_entity_1.Conversation, { eager: false, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'conversation_id' }),
    __metadata("design:type", conversation_entity_1.Conversation)
], UserReport.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'under_review', 'resolved', 'dismissed'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], UserReport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    }),
    __metadata("design:type", String)
], UserReport.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'reviewed_by' }),
    __metadata("design:type", String)
], UserReport.prototype, "reviewedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewed_by' }),
    __metadata("design:type", user_entity_1.User)
], UserReport.prototype, "reviewer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'reviewed_at' }),
    __metadata("design:type", Date)
], UserReport.prototype, "reviewedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserReport.prototype, "resolution", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: [
            'no_action',
            'warning_sent',
            'user_suspended',
            'user_banned',
            'content_removed',
        ],
        nullable: true,
        name: 'action_taken',
    }),
    __metadata("design:type", String)
], UserReport.prototype, "actionTaken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserReport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserReport.prototype, "updatedAt", void 0);
exports.UserReport = UserReport = __decorate([
    (0, typeorm_1.Entity)('user_reports'),
    (0, typeorm_1.Index)('idx_user_reports_reported_user', ['reportedUserId']),
    (0, typeorm_1.Index)('idx_user_reports_status', ['status']),
    (0, typeorm_1.Index)('idx_user_reports_priority', ['priority'])
], UserReport);
//# sourceMappingURL=user-report.entity.js.map