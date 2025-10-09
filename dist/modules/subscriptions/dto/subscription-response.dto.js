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
exports.SubscriptionHistoryResponseDto = exports.SubscriptionResponseDto = exports.SubscriptionPlanResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const subscription_entity_1 = require("../entities/subscription.entity");
class SubscriptionPlanResponseDto {
}
exports.SubscriptionPlanResponseDto = SubscriptionPlanResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionPlanResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionPlanResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "priceMonthly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "priceYearly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], SubscriptionPlanResponseDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "maxLikesPerDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "canSendMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "canViewLikes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "canSeeWhoLikedYou", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "prioritySupport", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionPlanResponseDto.prototype, "profileBadge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionPlanResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionPlanResponseDto.prototype, "displayOrder", void 0);
class SubscriptionResponseDto {
}
exports.SubscriptionResponseDto = SubscriptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SubscriptionPlanResponseDto }),
    __metadata("design:type", SubscriptionPlanResponseDto)
], SubscriptionResponseDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_entity_1.PaymentMethod }),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_entity_1.SubscriptionStatus }),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SubscriptionResponseDto.prototype, "autoRenew", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: subscription_entity_1.BillingCycle }),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "billingCycle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionResponseDto.prototype, "updatedAt", void 0);
class SubscriptionHistoryResponseDto {
}
exports.SubscriptionHistoryResponseDto = SubscriptionHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionHistoryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionHistoryResponseDto.prototype, "subscriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionHistoryResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SubscriptionPlanResponseDto }),
    __metadata("design:type", SubscriptionPlanResponseDto)
], SubscriptionHistoryResponseDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionHistoryResponseDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SubscriptionHistoryResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SubscriptionHistoryResponseDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], SubscriptionHistoryResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=subscription-response.dto.js.map