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
exports.MatchingPreferences = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../../auth/entities/user.entity");
let MatchingPreferences = class MatchingPreferences {
};
exports.MatchingPreferences = MatchingPreferences;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MatchingPreferences.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id', unique: true }),
    __metadata("design:type", String)
], MatchingPreferences.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], MatchingPreferences.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'min_age' }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "minAge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'max_age' }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "maxAge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'preferred_city' }),
    __metadata("design:type", String)
], MatchingPreferences.prototype, "preferredCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'preferred_country' }),
    __metadata("design:type", String)
], MatchingPreferences.prototype, "preferredCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        nullable: true,
        name: 'max_distance_km',
        comment: 'Maximum distance in kilometers (for future geo-search)',
    }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "maxDistanceKm", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_religious_practices',
        comment: 'Array of accepted religious practice levels',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredReligiousPractices", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_sects',
        comment: 'Array of accepted sects',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredSects", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_prayer_levels',
        comment: 'Array of accepted prayer levels',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredPrayerLevels", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_marital_statuses',
        comment: 'Array of accepted marital statuses',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredMaritalStatuses", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_professions',
        comment: 'Array of preferred professions',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredProfessions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['male', 'female'],
        nullable: true,
        name: 'looking_for_gender',
    }),
    __metadata("design:type", String)
], MatchingPreferences.prototype, "lookingForGender", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 5,
        name: 'age_importance',
        comment: 'Importance of age match (0-10)',
    }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "ageImportance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 5,
        name: 'location_importance',
        comment: 'Importance of location match (0-10)',
    }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "locationImportance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 8,
        name: 'religious_importance',
        comment: 'Importance of religious practice match (0-10)',
    }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "religiousImportance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 5,
        name: 'marital_status_importance',
        comment: 'Importance of marital status match (0-10)',
    }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "maritalStatusImportance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 3,
        name: 'profession_importance',
        comment: 'Importance of profession match (0-10)',
    }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "professionImportance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_min_height' }),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : value),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "preferredMinHeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_max_height' }),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : value),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "preferredMaxHeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_min_weight' }),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : value),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "preferredMinWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_max_weight' }),
    (0, class_transformer_1.Transform)(({ value }) => value ? parseFloat(value) : value),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "preferredMaxWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_body_colors',
        comment: 'Array of preferred body colors',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredBodyColors", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_hair_colors',
        comment: 'Array of preferred hair colors',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredHairColors", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_eye_colors',
        comment: 'Array of preferred eye colors',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredEyeColors", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        name: 'preferred_marriage_types',
        comment: 'Array of accepted marriage types',
    }),
    __metadata("design:type", Array)
], MatchingPreferences.prototype, "preferredMarriageTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['yes', 'no', 'thinking'],
        nullable: true,
        name: 'accept_polygamy',
        comment: 'Whether accepts polygamy: yes/no/thinking',
    }),
    __metadata("design:type", String)
], MatchingPreferences.prototype, "acceptPolygamy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true, name: 'require_house' }),
    __metadata("design:type", Boolean)
], MatchingPreferences.prototype, "requireHouse", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 5,
        name: 'physical_attributes_importance',
        comment: 'Importance of physical attributes match (0-10)',
    }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "physicalAttributesImportance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 7,
        name: 'marriage_type_importance',
        comment: 'Importance of marriage type match (0-10)',
    }),
    __metadata("design:type", Number)
], MatchingPreferences.prototype, "marriageTypeImportance", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MatchingPreferences.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], MatchingPreferences.prototype, "updatedAt", void 0);
exports.MatchingPreferences = MatchingPreferences = __decorate([
    (0, typeorm_1.Entity)('matching_preferences'),
    (0, typeorm_1.Index)('idx_matching_preferences_user', ['userId'])
], MatchingPreferences);
//# sourceMappingURL=matching-preferences.entity.js.map