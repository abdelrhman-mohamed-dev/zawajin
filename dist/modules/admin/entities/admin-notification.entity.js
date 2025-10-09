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
exports.AdminNotification = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
let AdminNotification = class AdminNotification {
};
exports.AdminNotification = AdminNotification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AdminNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'recipient_id' }),
    __metadata("design:type", String)
], AdminNotification.prototype, "recipientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'recipient_id' }),
    __metadata("design:type", user_entity_1.User)
], AdminNotification.prototype, "recipient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'sender_id' }),
    __metadata("design:type", String)
], AdminNotification.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", user_entity_1.User)
], AdminNotification.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AdminNotification.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AdminNotification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['email', 'push', 'internal'],
        name: 'notification_type',
    }),
    __metadata("design:type", String)
], AdminNotification.prototype, "notificationType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['sent', 'delivered', 'failed'],
    }),
    __metadata("design:type", String)
], AdminNotification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'sent_at' }),
    __metadata("design:type", Date)
], AdminNotification.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AdminNotification.prototype, "createdAt", void 0);
exports.AdminNotification = AdminNotification = __decorate([
    (0, typeorm_1.Entity)('admin_notifications'),
    (0, typeorm_1.Index)('idx_admin_notifications_recipient', ['recipientId'])
], AdminNotification);
//# sourceMappingURL=admin-notification.entity.js.map