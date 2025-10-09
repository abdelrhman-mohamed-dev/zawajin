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
exports.ResolveReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ResolveReportDto {
}
exports.ResolveReportDto = ResolveReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Resolution description',
        example: 'User has been warned and content removed',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResolveReportDto.prototype, "resolution", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Action taken',
        enum: [
            'no_action',
            'warning_sent',
            'user_suspended',
            'user_banned',
            'content_removed',
        ],
        example: 'warning_sent',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([
        'no_action',
        'warning_sent',
        'user_suspended',
        'user_banned',
        'content_removed',
    ]),
    __metadata("design:type", String)
], ResolveReportDto.prototype, "actionTaken", void 0);
//# sourceMappingURL=resolve-report.dto.js.map