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
exports.UpdatePlanDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePlanDto {
}
exports.UpdatePlanDto = UpdatePlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Plan name',
        example: 'Premium Plus',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monthly price in USD',
        example: 24.99,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "priceMonthly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Yearly price in USD',
        example: 249.99,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "priceYearly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of features included in the plan',
        example: ['Unlimited likes', 'See who liked you', 'Profile boost'],
        type: [String],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePlanDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum likes per day (null for unlimited)',
        example: 50,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "maxLikesPerDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Can send messages',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlanDto.prototype, "canSendMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Can view sent likes',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlanDto.prototype, "canViewLikes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Can see who liked them',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlanDto.prototype, "canSeeWhoLikedYou", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Has priority support',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlanDto.prototype, "prioritySupport", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Profile badge text',
        example: 'Premium Plus Member',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlanDto.prototype, "profileBadge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Display order for sorting plans',
        example: 5,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdatePlanDto.prototype, "displayOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Is plan active',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePlanDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-plan.dto.js.map