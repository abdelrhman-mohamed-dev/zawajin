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
exports.Block = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
let Block = class Block {
};
exports.Block = Block;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Block.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'blocker_id' }),
    __metadata("design:type", String)
], Block.prototype, "blockerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'blocked_id' }),
    __metadata("design:type", String)
], Block.prototype, "blockedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Block.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'blocker_id' }),
    __metadata("design:type", user_entity_1.User)
], Block.prototype, "blocker", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'blocked_id' }),
    __metadata("design:type", user_entity_1.User)
], Block.prototype, "blocked", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Block.prototype, "createdAt", void 0);
exports.Block = Block = __decorate([
    (0, typeorm_1.Entity)('blocks'),
    (0, typeorm_1.Unique)(['blockerId', 'blockedId']),
    (0, typeorm_1.Index)('idx_blocks_blocker_id', ['blockerId']),
    (0, typeorm_1.Index)('idx_blocks_blocked_id', ['blockedId'])
], Block);
//# sourceMappingURL=block.entity.js.map