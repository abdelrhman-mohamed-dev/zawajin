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
exports.BanUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class BanUserDto {
}
exports.BanUserDto = BanUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ban type - temporary or permanent',
        enum: ['temporary', 'permanent'],
        example: 'temporary',
    }),
    (0, class_validator_1.IsEnum)(['temporary', 'permanent']),
    __metadata("design:type", String)
], BanUserDto.prototype, "banType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for banning the user',
        example: 'Violating community guidelines',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BanUserDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date until the ban is active (required for temporary bans)',
        example: '2025-12-31T23:59:59.000Z',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BanUserDto.prototype, "bannedUntil", void 0);
//# sourceMappingURL=ban-user.dto.js.map