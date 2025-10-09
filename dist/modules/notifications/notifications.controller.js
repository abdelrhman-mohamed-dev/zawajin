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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const firebase_service_1 = require("../../services/firebase.service");
const send_notification_dto_1 = require("./dto/send-notification.dto");
const send_multicast_notification_dto_1 = require("./dto/send-multicast-notification.dto");
let NotificationsController = class NotificationsController {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async sendNotification(dto) {
        return await this.firebaseService.sendNotification(dto.token, dto.title, dto.body, dto.data);
    }
    async sendMulticastNotification(dto) {
        return await this.firebaseService.sendMulticastNotification(dto.tokens, dto.title, dto.body, dto.data);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send push notification to a single device' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification sent successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_notification_dto_1.SendPushNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)('send-multicast'),
    (0, swagger_1.ApiOperation)({ summary: 'Send push notification to multiple devices' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Multicast notification sent successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_multicast_notification_dto_1.SendMulticastPushNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendMulticastNotification", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map