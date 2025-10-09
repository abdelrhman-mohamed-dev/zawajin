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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPresenceRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_presence_entity_1 = require("../entities/user-presence.entity");
let UserPresenceRepository = class UserPresenceRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(user_presence_entity_1.UserPresence, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async setUserOnline(userId, socketId) {
        const presence = await this.findOne({ where: { userId } });
        if (presence) {
            presence.isOnline = true;
            presence.socketId = socketId;
            presence.lastSeenAt = new Date();
            return this.save(presence);
        }
        return this.save({
            userId,
            socketId,
            isOnline: true,
            lastSeenAt: new Date(),
        });
    }
    async setUserOffline(userId) {
        await this.update({ userId }, {
            isOnline: false,
            socketId: null,
            lastSeenAt: new Date(),
        });
    }
    async getUserPresence(userId) {
        return this.findOne({ where: { userId } });
    }
    async findBySocketId(socketId) {
        return this.findOne({ where: { socketId } });
    }
};
exports.UserPresenceRepository = UserPresenceRepository;
exports.UserPresenceRepository = UserPresenceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserPresenceRepository);
//# sourceMappingURL=user-presence.repository.js.map