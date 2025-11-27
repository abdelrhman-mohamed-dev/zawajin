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
exports.UpdatePreferencesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePreferencesDto {
}
exports.UpdatePreferencesDto = UpdatePreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum age preference',
        example: 25,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "minAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum age preference',
        example: 35,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "maxAge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred city',
        example: 'Dubai',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "preferredCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred country',
        example: 'UAE',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "preferredCountry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum distance in kilometers',
        example: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "maxDistanceKm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred religious practice levels',
        example: ['Religious', 'Moderate'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredReligiousPractices", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred sects',
        example: ['Sunni'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredSects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred prayer levels',
        example: ['Prays 5 times a day', 'Sometimes'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredPrayerLevels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred marital statuses',
        example: ['single', 'divorced'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredMaritalStatuses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred professions',
        example: ['Engineer', 'Doctor'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredProfessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gender looking for',
        example: 'female',
        enum: ['male', 'female'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['male', 'female']),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "lookingForGender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Age importance (0-10)',
        example: 5,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "ageImportance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Location importance (0-10)',
        example: 5,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "locationImportance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Religious importance (0-10)',
        example: 8,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "religiousImportance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Marital status importance (0-10)',
        example: 5,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "maritalStatusImportance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Profession importance (0-10)',
        example: 3,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "professionImportance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum preferred height',
        example: 160,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "preferredMinHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum preferred height',
        example: 180,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "preferredMaxHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum preferred weight',
        example: 50,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "preferredMinWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum preferred weight',
        example: 80,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "preferredMaxWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred body colors',
        example: ['fair', 'medium'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredBodyColors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred hair colors',
        example: ['black', 'brown'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredHairColors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred eye colors',
        example: ['brown', 'black'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredEyeColors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Preferred marriage types',
        example: ['traditional', 'modern'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferredMarriageTypes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Accept polygamy',
        example: 'yes',
        enum: ['yes', 'no', 'thinking'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['yes', 'no', 'thinking'], {
        message: 'acceptPolygamy must be either yes, no, or thinking',
    }),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "acceptPolygamy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Require house availability',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "requireHouse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Physical attributes importance (0-10)',
        example: 5,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "physicalAttributesImportance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Marriage type importance (0-10)',
        example: 7,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "marriageTypeImportance", void 0);
//# sourceMappingURL=update-preferences.dto.js.map