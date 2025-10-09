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
exports.LikeRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const like_entity_1 = require("../entities/like.entity");
let LikeRepository = class LikeRepository {
    constructor(likeRepo) {
        this.likeRepo = likeRepo;
    }
    async create(userId, likedUserId) {
        const like = this.likeRepo.create({ userId, likedUserId });
        return await this.likeRepo.save(like);
    }
    async findByUserAndLikedUser(userId, likedUserId) {
        return await this.likeRepo.findOne({
            where: { userId, likedUserId },
        });
    }
    async delete(userId, likedUserId) {
        await this.likeRepo.delete({ userId, likedUserId });
    }
    async findLikesSentByUser(userId) {
        return await this.likeRepo.find({
            where: { userId },
            relations: ['likedUser'],
            order: { createdAt: 'DESC' },
        });
    }
    async findLikesReceivedByUser(userId) {
        return await this.likeRepo.find({
            where: { likedUserId: userId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async checkMutualLike(userId, otherUserId) {
        const like1 = await this.findByUserAndLikedUser(userId, otherUserId);
        const like2 = await this.findByUserAndLikedUser(otherUserId, userId);
        return !!(like1 && like2);
    }
    async countLikesSent(userId) {
        return await this.likeRepo.count({ where: { userId } });
    }
    async countLikesReceived(userId) {
        return await this.likeRepo.count({ where: { likedUserId: userId } });
    }
};
exports.LikeRepository = LikeRepository;
exports.LikeRepository = LikeRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LikeRepository);
//# sourceMappingURL=like.repository.js.map