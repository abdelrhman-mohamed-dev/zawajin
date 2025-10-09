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
exports.MatchingPreferencesRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const matching_preferences_entity_1 = require("../entities/matching-preferences.entity");
let MatchingPreferencesRepository = class MatchingPreferencesRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findByUserId(userId) {
        return await this.repository.findOne({
            where: { userId },
        });
    }
    async createOrUpdate(userId, data) {
        const existing = await this.findByUserId(userId);
        if (existing) {
            Object.assign(existing, data);
            return await this.repository.save(existing);
        }
        const preferences = this.repository.create({
            userId,
            ...data,
        });
        return await this.repository.save(preferences);
    }
    async delete(userId) {
        await this.repository.delete({ userId });
    }
};
exports.MatchingPreferencesRepository = MatchingPreferencesRepository;
exports.MatchingPreferencesRepository = MatchingPreferencesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(matching_preferences_entity_1.MatchingPreferences)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MatchingPreferencesRepository);
//# sourceMappingURL=matching-preferences.repository.js.map