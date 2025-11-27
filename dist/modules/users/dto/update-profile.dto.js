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
exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const profile_enums_1 = require("../../../common/enums/profile.enums");
class LocationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dubai', description: 'City name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LocationDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'UAE', description: 'Country name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LocationDto.prototype, "country", void 0);
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1995-05-15',
        description: 'Date of birth (YYYY-MM-DD format)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 30,
        description: 'User age (auto-calculated from dateOfBirth if provided)',
        minimum: 18,
        maximum: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { city: 'Dubai', country: 'UAE' },
        description: 'User location',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDto),
    __metadata("design:type", LocationDto)
], UpdateProfileDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Pakistani',
        description: 'Country or region of origin',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john_doe',
        description: 'Username',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Saudi',
        description: 'User nationality',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "nationality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Riyadh',
        description: 'Place of residence',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "placeOfResidence", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.Tribe.TRIBAL,
        description: 'Tribe status',
        enum: profile_enums_1.Tribe,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.Tribe),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "tribe", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.MaritalStatus.SINGLE,
        description: 'Marital status (use appropriate value based on gender)',
        enum: profile_enums_1.MaritalStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.MaritalStatus),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0,
        description: 'Number of children',
        minimum: 0,
        maximum: 20,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "numberOfChildren", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.EducationLevel.UNIVERSITY,
        description: 'Educational level',
        enum: profile_enums_1.EducationLevel,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.EducationLevel),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "educationLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.FinancialStatus.GOOD,
        description: 'Financial status',
        enum: profile_enums_1.FinancialStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.FinancialStatus),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "financialStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.HealthStatus.HEALTHY,
        description: 'Health status',
        enum: profile_enums_1.HealthStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.HealthStatus),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "healthStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.ReligiosityLevel.COMMITTED,
        description: 'Level of religiosity',
        enum: profile_enums_1.ReligiosityLevel,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.ReligiosityLevel),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "religiosityLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Software Engineer',
        description: 'Profession/occupation',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 70.5,
        description: 'Weight in kilograms',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 175.5,
        description: 'Height in centimeters',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(250),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.SkinColor.WHITE,
        description: 'Skin color',
        enum: profile_enums_1.SkinColor,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.SkinColor),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "skinColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.Beauty.AVERAGE,
        description: 'Beauty/appearance rating (use appropriate values based on gender)',
        enum: profile_enums_1.Beauty,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.Beauty),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "beauty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.BodyColor.MEDIUM,
        description: 'Skin tone/body color',
        enum: profile_enums_1.BodyColor,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.BodyColor),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bodyColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.HairColor.BLACK,
        description: 'Hair color',
        enum: profile_enums_1.HairColor,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.HairColor),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "hairColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.HairType.STRAIGHT,
        description: 'Hair type',
        enum: profile_enums_1.HairType,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.HairType),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "hairType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.EyeColor.BROWN,
        description: 'Eye color',
        enum: profile_enums_1.EyeColor,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.EyeColor),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "eyeColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.HijabStyle.HIJAB,
        description: 'Hijab style (for female users only)',
        enum: profile_enums_1.HijabStyle,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.HijabStyle),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "hijabStyle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the user owns a house',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProfileDto.prototype, "houseAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.EmploymentType.EMPLOYED,
        description: 'Nature or type of work',
        enum: profile_enums_1.EmploymentType,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.EmploymentType),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "natureOfWork", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'A kind and practicing Muslim looking for a life partner.',
        description: 'User bio/description',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25,
        description: 'Preferred minimum age for partner',
        minimum: 18,
        maximum: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "preferredAgeFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 35,
        description: 'Preferred maximum age for partner',
        minimum: 18,
        maximum: 100,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(18),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "preferredAgeTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Preferred minimum weight for partner (kg)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "preferredMinWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 80,
        description: 'Preferred maximum weight for partner (kg)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "preferredMaxWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 150,
        description: 'Preferred minimum height for partner (cm)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(250),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "preferredMinHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 180,
        description: 'Preferred maximum height for partner (cm)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(250),
    __metadata("design:type", Number)
], UpdateProfileDto.prototype, "preferredMaxHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Saudi',
        description: 'Preferred nationality for partner',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredNationality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Riyadh',
        description: 'Preferred residence place for partner',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredResidencePlace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.EducationLevel.UNIVERSITY,
        description: 'Preferred education level for partner',
        enum: profile_enums_1.EducationLevel,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.EducationLevel),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredEducationLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.EmploymentType.EMPLOYED,
        description: 'Preferred work nature for partner',
        enum: profile_enums_1.EmploymentType,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.EmploymentType),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredWorkNature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.MaritalStatus.SINGLE,
        description: 'Preferred marital status for partner',
        enum: profile_enums_1.MaritalStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.MaritalStatus),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredMaritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.FinancialStatus.GOOD,
        description: 'Preferred financial status for partner',
        enum: profile_enums_1.FinancialStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.FinancialStatus),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredFinancialStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether partner should have a house',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProfileDto.prototype, "preferredHasHouse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.HealthStatus.HEALTHY,
        description: 'Preferred health status for partner',
        enum: profile_enums_1.HealthStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.HealthStatus),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredHealthStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.Beauty.AVERAGE,
        description: 'Preferred beauty/appearance for partner',
        enum: profile_enums_1.Beauty,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.Beauty),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredBeauty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.SkinColor.WHITE,
        description: 'Preferred skin color for partner',
        enum: profile_enums_1.SkinColor,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.SkinColor),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredSkinColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.ReligiosityLevel.COMMITTED,
        description: 'Preferred religiosity level for partner',
        enum: profile_enums_1.ReligiosityLevel,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.ReligiosityLevel),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredReligiosityLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'yes',
        description: 'Whether accepts polygamy for partner (males only)',
        enum: ['yes', 'no', 'thinking'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['yes', 'no', 'thinking'], {
        message: 'preferredAcceptPolygamy must be either yes, no, or thinking',
    }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredAcceptPolygamy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.MarriageType.RELIGIOUS,
        description: 'Preferred marriage type for partner',
        enum: profile_enums_1.MarriageType,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.MarriageType),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredMarriageType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [profile_enums_1.BodyColor.FAIR, profile_enums_1.BodyColor.MEDIUM],
        description: 'Preferred body colors for partner',
        enum: profile_enums_1.BodyColor,
        isArray: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.BodyColor, { each: true }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "preferredBodyColors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [profile_enums_1.HairColor.BLACK, profile_enums_1.HairColor.DARK_BROWN],
        description: 'Preferred hair colors for partner',
        enum: profile_enums_1.HairColor,
        isArray: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.HairColor, { each: true }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "preferredHairColors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [profile_enums_1.EyeColor.BROWN, profile_enums_1.EyeColor.HAZEL],
        description: 'Preferred eye colors for partner',
        enum: profile_enums_1.EyeColor,
        isArray: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.EyeColor, { each: true }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "preferredEyeColors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Looking for someone who is kind, religious, and family-oriented.',
        description: 'Additional preferences or description of ideal partner',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "partnerPreferencesBio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.MarriageType.RELIGIOUS,
        description: 'Type of marriage preference',
        enum: profile_enums_1.MarriageType,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.MarriageType),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "marriageType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether the user accepts polygamy',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProfileDto.prototype, "acceptPolygamy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: profile_enums_1.PolygamyStatus.NO,
        description: 'Polygamy status (for women) or polygamy intention (for men)',
        enum: profile_enums_1.PolygamyStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(profile_enums_1.PolygamyStatus),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "polygamyStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Looking for a serious relationship...',
        description: 'Detailed profile description (no phone numbers or contact info allowed)',
        maxLength: 2000,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "detailedProfile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'male',
        description: 'User gender',
        enum: ['male', 'female'],
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['male', 'female'], {
        message: 'Gender must be either male or female',
    }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Religious',
        description: 'Level of religious practice',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "religiousPractice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sunni',
        description: 'Religious sect',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "sect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Prays 5 times a day',
        description: 'Prayer level',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "prayerLevel", void 0);
//# sourceMappingURL=update-profile.dto.js.map