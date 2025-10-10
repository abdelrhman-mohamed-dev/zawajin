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
exports.GetUsersDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class GetUsersDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.GetUsersDto = GetUsersDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Page number',
        required: false,
        default: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetUsersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Number of items per page',
        required: false,
        default: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetUsersDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'male',
        description: 'Filter by gender',
        enum: ['male', 'female'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['male', 'female']),
    __metadata("design:type", String)
], GetUsersDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'single',
        description: 'Filter by marital status',
        enum: ['single', 'divorced', 'widowed'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['single', 'divorced', 'widowed']),
    __metadata("design:type", String)
], GetUsersDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25,
        description: 'Minimum age filter',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    __metadata("design:type", Number)
], GetUsersDto.prototype, "minAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 35,
        description: 'Maximum age filter',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    __metadata("design:type", Number)
], GetUsersDto.prototype, "maxAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Dubai',
        description: 'Filter by city',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'UAE',
        description: 'Filter by country',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Egyptian',
        description: 'Filter by origin',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Religious',
        description: 'Filter by religious practice',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "religiousPractice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sunni',
        description: 'Filter by sect',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "sect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Prays 5 times a day',
        description: 'Filter by prayer level',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "prayerLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Engineer',
        description: 'Filter by profession',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 165,
        description: 'Minimum height (cm)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], GetUsersDto.prototype, "minHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 180,
        description: 'Maximum height (cm)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], GetUsersDto.prototype, "maxHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Minimum weight (kg)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    __metadata("design:type", Number)
], GetUsersDto.prototype, "minWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 80,
        description: 'Maximum weight (kg)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    __metadata("design:type", Number)
], GetUsersDto.prototype, "maxWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'fair',
        description: 'Filter by body color',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "bodyColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'black',
        description: 'Filter by hair color',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "hairColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'straight',
        description: 'Filter by hair type',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "hairType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'brown',
        description: 'Filter by eye color',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "eyeColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'religious',
        description: 'Filter by marriage type',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "marriageType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Filter by house availability',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetUsersDto.prototype, "houseAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Filter by polygamy acceptance',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetUsersDto.prototype, "acceptPolygamy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Full-time office job',
        description: 'Filter by nature of work',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetUsersDto.prototype, "natureOfWork", void 0);
//# sourceMappingURL=get-users.dto.js.map