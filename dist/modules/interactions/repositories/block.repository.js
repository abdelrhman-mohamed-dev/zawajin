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
exports.BlockRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const block_entity_1 = require("../entities/block.entity");
let BlockRepository = class BlockRepository {
    constructor(blockRepo) {
        this.blockRepo = blockRepo;
    }
    async create(blockerId, blockedId, reason) {
        const block = this.blockRepo.create({ blockerId, blockedId, reason });
        return await this.blockRepo.save(block);
    }
    async findByBlockerAndBlocked(blockerId, blockedId) {
        return await this.blockRepo.findOne({
            where: { blockerId, blockedId },
        });
    }
    async delete(blockerId, blockedId) {
        await this.blockRepo.delete({ blockerId, blockedId });
    }
    async findBlocksByUser(blockerId) {
        return await this.blockRepo.find({
            where: { blockerId },
            relations: ['blocked'],
            order: { createdAt: 'DESC' },
        });
    }
    async isBlocked(blockerId, blockedId) {
        const block = await this.findByBlockerAndBlocked(blockerId, blockedId);
        return !!block;
    }
    async isBlockedByEither(userId1, userId2) {
        const block1 = await this.isBlocked(userId1, userId2);
        const block2 = await this.isBlocked(userId2, userId1);
        return block1 || block2;
    }
    async countBlocks(blockerId) {
        return await this.blockRepo.count({ where: { blockerId } });
    }
};
exports.BlockRepository = BlockRepository;
exports.BlockRepository = BlockRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(block_entity_1.Block)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlockRepository);
//# sourceMappingURL=block.repository.js.map