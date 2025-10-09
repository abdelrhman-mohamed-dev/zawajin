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
exports.AdminActionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_action_entity_1 = require("../entities/admin-action.entity");
let AdminActionRepository = class AdminActionRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(actionData) {
        const action = this.repository.create(actionData);
        return this.repository.save(action);
    }
    async findByAdminId(adminId, page = 1, limit = 50) {
        const [actions, total] = await this.repository.findAndCount({
            where: { adminId },
            relations: ['targetUser'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { actions, total };
    }
    async findByTargetUserId(targetUserId, page = 1, limit = 50) {
        const [actions, total] = await this.repository.findAndCount({
            where: { targetUserId },
            relations: ['admin'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { actions, total };
    }
    async getRecentActions(days = 30) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.repository
            .createQueryBuilder('action')
            .select('action.actionType', 'actionType')
            .addSelect('COUNT(*)', 'count')
            .where('action.createdAt >= :date', { date })
            .groupBy('action.actionType')
            .orderBy('count', 'DESC')
            .getRawMany();
    }
};
exports.AdminActionRepository = AdminActionRepository;
exports.AdminActionRepository = AdminActionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_action_entity_1.AdminAction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminActionRepository);
//# sourceMappingURL=admin-action.repository.js.map