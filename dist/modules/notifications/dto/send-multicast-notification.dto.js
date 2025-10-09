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
exports.SendMulticastPushNotificationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SendMulticastPushNotificationDto {
}
exports.SendMulticastPushNotificationDto = SendMulticastPushNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of FCM tokens',
        example: ['token1', 'token2', 'token3'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SendMulticastPushNotificationDto.prototype, "tokens", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification title',
        example: 'New Announcement',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMulticastPushNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification body',
        example: 'Check out our latest updates',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMulticastPushNotificationDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional data payload',
        example: { type: 'announcement', id: '789' },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendMulticastPushNotificationDto.prototype, "data", void 0);
//# sourceMappingURL=send-multicast-notification.dto.js.map