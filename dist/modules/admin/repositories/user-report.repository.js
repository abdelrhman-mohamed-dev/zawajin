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
exports.UserReportRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_report_entity_1 = require("../entities/user-report.entity");
let UserReportRepository = class UserReportRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async create(reportData) {
        const report = this.repository.create(reportData);
        return this.repository.save(report);
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['reporter', 'reportedUser', 'reviewer'],
        });
    }
    async findAll(page = 1, limit = 20, status, priority) {
        const query = this.repository.createQueryBuilder('report');
        if (status) {
            query.andWhere('report.status = :status', { status });
        }
        if (priority) {
            query.andWhere('report.priority = :priority', { priority });
        }
        query
            .leftJoinAndSelect('report.reporter', 'reporter')
            .leftJoinAndSelect('report.reportedUser', 'reportedUser')
            .leftJoinAndSelect('report.reviewer', 'reviewer')
            .orderBy('report.priority', 'DESC')
            .addOrderBy('report.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [reports, total] = await query.getManyAndCount();
        return { reports, total };
    }
    async findByReportedUser(userId) {
        return this.repository.find({
            where: { reportedUserId: userId },
            relations: ['reporter', 'reviewer'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateData) {
        await this.repository.update(id, updateData);
        return this.findById(id);
    }
};
exports.UserReportRepository = UserReportRepository;
exports.UserReportRepository = UserReportRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_report_entity_1.UserReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserReportRepository);
//# sourceMappingURL=user-report.repository.js.map