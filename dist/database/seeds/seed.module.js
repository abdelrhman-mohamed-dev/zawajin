"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seed_controller_1 = require("./seed.controller");
const subscription_plan_entity_1 = require("../../modules/subscriptions/entities/subscription-plan.entity");
const user_entity_1 = require("../../modules/auth/entities/user.entity");
const matching_preferences_entity_1 = require("../../modules/matching/entities/matching-preferences.entity");
const like_entity_1 = require("../../modules/interactions/entities/like.entity");
const conversation_entity_1 = require("../../modules/chat/entities/conversation.entity");
const message_entity_1 = require("../../modules/chat/entities/message.entity");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                subscription_plan_entity_1.SubscriptionPlan,
                user_entity_1.User,
                matching_preferences_entity_1.MatchingPreferences,
                like_entity_1.Like,
                conversation_entity_1.Conversation,
                message_entity_1.Message,
            ]),
        ],
        controllers: [seed_controller_1.SeedController],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map