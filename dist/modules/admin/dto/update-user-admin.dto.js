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
exports.UpdateUserAdminDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateUserAdminDto {
}
exports.UpdateUserAdminDto = UpdateUserAdminDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Full name of the user',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Email address',
        example: 'john@example.com',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Phone number',
        example: '+1234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User biography',
        example: 'Looking for a life partner...',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Age of the user',
        example: 28,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateUserAdminDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Gender',
        enum: ['male', 'female'],
        example: 'male',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['male', 'female']),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Location object with city and country',
        example: { city: 'Dubai', country: 'UAE' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateUserAdminDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Religious practice level',
        example: 'Religious',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "religiousPractice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sect',
        example: 'Sunni',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "sect", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Prayer level',
        example: 'Prays 5 times a day',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "prayerLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Marital status',
        enum: ['single', 'divorced', 'widowed'],
        example: 'single',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['single', 'divorced', 'widowed']),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profession',
        example: 'Software Engineer',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is email verified',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserAdminDto.prototype, "isEmailVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is phone verified',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserAdminDto.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Is user active',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserAdminDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-user-admin.dto.js.map