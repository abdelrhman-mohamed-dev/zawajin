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
exports.MatchingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const matching_service_1 = require("../services/matching.service");
const update_preferences_dto_1 = require("../dto/update-preferences.dto");
const get_recommendations_dto_1 = require("../dto/get-recommendations.dto");
let MatchingController = class MatchingController {
    constructor(matchingService) {
        this.matchingService = matchingService;
    }
    async updatePreferences(req, updatePreferencesDto) {
        const userId = req.user.sub;
        const preferences = await this.matchingService.updatePreferences(userId, updatePreferencesDto);
        return {
            success: true,
            message: 'Matching preferences updated successfully',
            data: preferences,
        };
    }
    async getPreferences(req) {
        const userId = req.user.sub;
        const preferences = await this.matchingService.getPreferences(userId);
        return {
            success: true,
            data: preferences,
        };
    }
    async getRecommendations(req, query) {
        const userId = req.user.sub;
        const recommendations = await this.matchingService.getRecommendations(userId, query);
        return {
            success: true,
            message: 'Match recommendations retrieved successfully',
            ...recommendations,
        };
    }
};
exports.MatchingController = MatchingController;
__decorate([
    (0, common_1.Put)('preferences'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update matching preferences' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preferences updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_preferences_dto_1.UpdatePreferencesDto]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user matching preferences' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preferences retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Preferences not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get match recommendations based on preferences and filters',
        description: 'Get personalized match recommendations with comprehensive filtering options including location, religion, physical attributes, and marriage preferences. Supports pagination and compatibility score filtering.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Recommendations retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_recommendations_dto_1.GetRecommendationsDto]),
    __metadata("design:returntype", Promise)
], MatchingController.prototype, "getRecommendations", null);
exports.MatchingController = MatchingController = __decorate([
    (0, swagger_1.ApiTags)('Matching'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('matching'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [matching_service_1.MatchingService])
], MatchingController);
//# sourceMappingURL=matching.controller.js.map