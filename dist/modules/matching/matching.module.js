"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const matching_preferences_entity_1 = require("./entities/matching-preferences.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const like_entity_1 = require("../interactions/entities/like.entity");
const matching_service_1 = require("./services/matching.service");
const matching_controller_1 = require("./controllers/matching.controller");
const matching_preferences_repository_1 = require("./repositories/matching-preferences.repository");
let MatchingModule = class MatchingModule {
};
exports.MatchingModule = MatchingModule;
exports.MatchingModule = MatchingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([matching_preferences_entity_1.MatchingPreferences, user_entity_1.User, like_entity_1.Like])],
        controllers: [matching_controller_1.MatchingController],
        providers: [matching_service_1.MatchingService, matching_preferences_repository_1.MatchingPreferencesRepository],
        exports: [matching_service_1.MatchingService],
    })
], MatchingModule);
//# sourceMappingURL=matching.module.js.map