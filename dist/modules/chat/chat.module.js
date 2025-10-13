"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const platform_express_1 = require("@nestjs/platform-express");
const chat_controller_1 = require("./controllers/chat.controller");
const upload_controller_1 = require("./controllers/upload.controller");
const chat_service_1 = require("./services/chat.service");
const chat_gateway_1 = require("./gateways/chat.gateway");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const user_presence_entity_1 = require("./entities/user-presence.entity");
const engagement_request_entity_1 = require("./entities/engagement-request.entity");
const conversation_repository_1 = require("./repositories/conversation.repository");
const message_repository_1 = require("./repositories/message.repository");
const user_presence_repository_1 = require("./repositories/user-presence.repository");
const engagement_request_repository_1 = require("./repositories/engagement-request.repository");
const like_entity_1 = require("../interactions/entities/like.entity");
const block_entity_1 = require("../interactions/entities/block.entity");
const ws_jwt_guard_1 = require("./guards/ws-jwt.guard");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                conversation_entity_1.Conversation,
                message_entity_1.Message,
                user_presence_entity_1.UserPresence,
                engagement_request_entity_1.EngagementRequest,
                like_entity_1.Like,
                block_entity_1.Block,
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '7d' },
            }),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        controllers: [chat_controller_1.ChatController, upload_controller_1.UploadController],
        providers: [
            chat_service_1.ChatService,
            chat_gateway_1.ChatGateway,
            conversation_repository_1.ConversationRepository,
            message_repository_1.MessageRepository,
            user_presence_repository_1.UserPresenceRepository,
            engagement_request_repository_1.EngagementRequestRepository,
            ws_jwt_guard_1.WsJwtGuard,
        ],
        exports: [chat_service_1.ChatService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map