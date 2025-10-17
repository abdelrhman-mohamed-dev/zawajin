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
exports.GetRecommendationsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GetRecommendationsDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.GetRecommendationsDto = GetRecommendationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number',
        example: 1,
        default: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetRecommendationsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of results per page',
        example: 10,
        default: 10,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], GetRecommendationsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum compatibility score (0-100)',
        example: 50,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetRecommendationsDto.prototype, "minCompatibilityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by gender',
        example: 'female',
        enum: ['male', 'female'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['male', 'female']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by marital status',
        example: 'single',
        enum: ['single', 'divorced', 'widowed'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['single', 'divorced', 'widowed']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum age',
        example: 25,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetRecommendationsDto.prototype, "minAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum age',
        example: 35,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetRecommendationsDto.prototype, "maxAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Dubai',
        description: 'Filter by city',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'UAE',
        description: 'Filter by country',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Egyptian',
        description: 'Filter by origin',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Religious',
        description: 'Filter by religious practice',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "religiousPractice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sunni',
        description: 'Filter by sect',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "sect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Prays 5 times a day',
        description: 'Filter by prayer level',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "prayerLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Engineer',
        description: 'Filter by profession',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "profession", void 0);
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
], GetRecommendationsDto.prototype, "minHeight", void 0);
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
], GetRecommendationsDto.prototype, "maxHeight", void 0);
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
], GetRecommendationsDto.prototype, "minWeight", void 0);
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
], GetRecommendationsDto.prototype, "maxWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'fair',
        description: 'Filter by body color',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "bodyColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'black',
        description: 'Filter by hair color',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "hairColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'straight',
        description: 'Filter by hair type',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "hairType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'brown',
        description: 'Filter by eye color',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "eyeColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'religious',
        description: 'Filter by marriage type',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "marriageType", void 0);
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
], GetRecommendationsDto.prototype, "houseAvailable", void 0);
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
], GetRecommendationsDto.prototype, "acceptPolygamy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Full-time office job',
        description: 'Filter by nature of work',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "natureOfWork", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Saudi',
        description: 'Filter by nationality',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "nationality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Riyadh',
        description: 'Filter by place of residence',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "placeOfResidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'tribal',
        description: 'Filter by tribe',
        enum: ['tribal', 'non_tribal', 'other'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['tribal', 'non_tribal', 'other']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "tribe", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Filter by number of children',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GetRecommendationsDto.prototype, "numberOfChildren", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'university',
        description: 'Filter by education level',
        enum: ['secondary', 'diploma', 'university', 'higher_education'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['secondary', 'diploma', 'university', 'higher_education']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "educationLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'good',
        description: 'Filter by financial status',
        enum: ['poor', 'good', 'excellent'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['poor', 'good', 'excellent']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "financialStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'healthy',
        description: 'Filter by health status',
        enum: ['healthy', 'chronically_ill', 'disabled'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['healthy', 'chronically_ill', 'disabled']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "healthStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'committed',
        description: 'Filter by religiosity level',
        enum: ['normal', 'conservative', 'committed'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['normal', 'conservative', 'committed']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "religiosityLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'white',
        description: 'Filter by skin color',
        enum: ['white', 'brown', 'black'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['white', 'brown', 'black']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "skinColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'handsome',
        description: 'Filter by beauty/appearance',
        enum: ['acceptable', 'average', 'handsome', 'beautiful', 'very_beautiful'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['acceptable', 'average', 'handsome', 'beautiful', 'very_beautiful']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "beauty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'no',
        description: 'Filter by polygamy status',
        enum: ['yes', 'no', 'thinking'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['yes', 'no', 'thinking']),
    __metadata("design:type", String)
], GetRecommendationsDto.prototype, "polygamyStatus", void 0);
//# sourceMappingURL=get-recommendations.dto.js.map