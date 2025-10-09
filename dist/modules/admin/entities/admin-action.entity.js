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
exports.AdminAction = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
let AdminAction = class AdminAction {
};
exports.AdminAction = AdminAction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AdminAction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'admin_id' }),
    __metadata("design:type", String)
], AdminAction.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'admin_id' }),
    __metadata("design:type", user_entity_1.User)
], AdminAction.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: [
            'ban_user',
            'unban_user',
            'delete_user',
            'edit_user',
            'verify_user',
            'resolve_report',
            'edit_subscription',
            'create_admin',
            'promote_admin',
            'demote_admin',
            'remove_admin',
        ],
        name: 'action_type',
    }),
    __metadata("design:type", String)
], AdminAction.prototype, "actionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'target_user_id' }),
    __metadata("design:type", String)
], AdminAction.prototype, "targetUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'target_user_id' }),
    __metadata("design:type", user_entity_1.User)
], AdminAction.prototype, "targetUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'target_id' }),
    __metadata("design:type", String)
], AdminAction.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AdminAction.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Details of the action taken',
    }),
    __metadata("design:type", Object)
], AdminAction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AdminAction.prototype, "createdAt", void 0);
exports.AdminAction = AdminAction = __decorate([
    (0, typeorm_1.Entity)('admin_actions'),
    (0, typeorm_1.Index)('idx_admin_actions_admin', ['adminId']),
    (0, typeorm_1.Index)('idx_admin_actions_created', ['createdAt'])
], AdminAction);
//# sourceMappingURL=admin-action.entity.js.map