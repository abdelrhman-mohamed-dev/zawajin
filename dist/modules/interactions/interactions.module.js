"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const interactions_controller_1 = require("./controllers/interactions.controller");
const interactions_service_1 = require("./services/interactions.service");
const like_entity_1 = require("./entities/like.entity");
const block_entity_1 = require("./entities/block.entity");
const like_repository_1 = require("./repositories/like.repository");
const block_repository_1 = require("./repositories/block.repository");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("../users/users.module");
let InteractionsModule = class InteractionsModule {
};
exports.InteractionsModule = InteractionsModule;
exports.InteractionsModule = InteractionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([like_entity_1.Like, block_entity_1.Block]), auth_module_1.AuthModule, users_module_1.UsersModule],
        controllers: [interactions_controller_1.InteractionsController],
        providers: [interactions_service_1.InteractionsService, like_repository_1.LikeRepository, block_repository_1.BlockRepository],
        exports: [interactions_service_1.InteractionsService],
    })
], InteractionsModule);
//# sourceMappingURL=interactions.module.js.map