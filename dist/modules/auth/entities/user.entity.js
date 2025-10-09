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
exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
    generateChartNumber() {
        if (!this.chartNumber) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const randomChars = chars.charAt(Math.floor(Math.random() * chars.length)) +
                chars.charAt(Math.floor(Math.random() * chars.length));
            const randomDigits = Math.floor(100000 + Math.random() * 900000);
            this.chartNumber = `${randomChars}-${randomDigits}`;
        }
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, name: 'full_name' }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['male', 'female'] }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'password_hash' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, name: 'chart_number' }),
    __metadata("design:type", String)
], User.prototype, "chartNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_email_verified' }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_phone_verified' }),
    __metadata("design:type", Boolean)
], User.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'fcm_token' }),
    __metadata("design:type", String)
], User.prototype, "fcmToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'date_of_birth' }),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    (0, typeorm_1.Index)('idx_users_age'),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Location object with city and country',
    }),
    __metadata("design:type", Object)
], User.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "origin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['single', 'divorced', 'widowed'],
        nullable: true,
        name: 'marital_status',
    }),
    (0, typeorm_1.Index)('idx_users_marital_status'),
    __metadata("design:type", String)
], User.prototype, "maritalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'body_color' }),
    __metadata("design:type", String)
], User.prototype, "bodyColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'hair_color' }),
    __metadata("design:type", String)
], User.prototype, "hairColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'hair_type' }),
    __metadata("design:type", String)
], User.prototype, "hairType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'eye_color' }),
    __metadata("design:type", String)
], User.prototype, "eyeColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true, name: 'house_available' }),
    __metadata("design:type", Boolean)
], User.prototype, "houseAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'nature_of_work' }),
    __metadata("design:type", String)
], User.prototype, "natureOfWork", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_min_weight' }),
    __metadata("design:type", Number)
], User.prototype, "preferredMinWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_max_weight' }),
    __metadata("design:type", Number)
], User.prototype, "preferredMaxWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_min_height' }),
    __metadata("design:type", Number)
], User.prototype, "preferredMinHeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_max_height' }),
    __metadata("design:type", Number)
], User.prototype, "preferredMaxHeight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Array of preferred body colors',
    }),
    __metadata("design:type", Array)
], User.prototype, "preferredBodyColors", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Array of preferred hair colors',
    }),
    __metadata("design:type", Array)
], User.prototype, "preferredHairColors", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Array of preferred eye colors',
    }),
    __metadata("design:type", Array)
], User.prototype, "preferredEyeColors", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'partner_preferences_bio' }),
    __metadata("design:type", String)
], User.prototype, "partnerPreferencesBio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, name: 'marriage_type' }),
    __metadata("design:type", String)
], User.prototype, "marriageType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true, name: 'accept_polygamy' }),
    __metadata("design:type", Boolean)
], User.prototype, "acceptPolygamy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'religious_practice' }),
    (0, typeorm_1.Index)('idx_users_religious_practice'),
    __metadata("design:type", String)
], User.prototype, "religiousPractice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "sect", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, name: 'prayer_level' }),
    __metadata("design:type", String)
], User.prototype, "prayerLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['user', 'admin', 'super_admin'],
        default: 'user',
    }),
    (0, typeorm_1.Index)('idx_users_role'),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'jsonb',
        nullable: true,
        comment: 'Array of permission strings for granular admin access control',
    }),
    __metadata("design:type", Array)
], User.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_banned' }),
    __metadata("design:type", Boolean)
], User.prototype, "isBanned", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['temporary', 'permanent'],
        nullable: true,
        name: 'ban_type',
    }),
    __metadata("design:type", String)
], User.prototype, "banType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'banned_at' }),
    __metadata("design:type", Date)
], User.prototype, "bannedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'banned_until' }),
    __metadata("design:type", Date)
], User.prototype, "bannedUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'banned_reason' }),
    __metadata("design:type", String)
], User.prototype, "bannedReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'banned_by' }),
    __metadata("design:type", String)
], User.prototype, "bannedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_verified' }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'verified_at' }),
    __metadata("design:type", Date)
], User.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'verified_by' }),
    __metadata("design:type", String)
], User.prototype, "verifiedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'is_deleted' }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'deleted_at' }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'role_assigned_by' }),
    __metadata("design:type", String)
], User.prototype, "roleAssignedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'role_assigned_at' }),
    __metadata("design:type", Date)
], User.prototype, "roleAssignedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "generateChartNumber", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)('idx_users_email', ['email']),
    (0, typeorm_1.Index)('idx_users_chart_number', ['chartNumber'])
], User);
//# sourceMappingURL=user.entity.js.map