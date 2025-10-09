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
exports.RegisterDto = exports.Gender = void 0;
exports.IsPasswordConfirmed = IsPasswordConfirmed;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (exports.Gender = Gender = {}));
function IsPasswordConfirmed(validationOptions) {
    return (0, class_validator_1.ValidateBy)({
        name: 'isPasswordConfirmed',
        validator: {
            validate: (value, args) => {
                return value === args.object.password;
            },
            defaultMessage: () => 'Passwords do not match / كلمات المرور غير متطابقة',
        },
    }, validationOptions);
}
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of the user',
        example: 'أحمد محمد علي',
        minLength: 2,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)({ message: 'Full name must be a string / الاسم الكامل يجب أن يكون نص' }),
    (0, class_validator_1.MinLength)(2, { message: 'Full name must be at least 2 characters / الاسم الكامل يجب أن يكون على الأقل حرفين' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Full name must not exceed 100 characters / الاسم الكامل يجب ألا يتجاوز 100 حرف' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User gender',
        example: 'male',
        enum: Gender,
    }),
    (0, class_validator_1.IsEnum)(Gender, { message: 'Gender must be either male or female / الجنس يجب أن يكون ذكر أو أنثى' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valid email address',
        example: 'an.roooof@gmail.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address / يرجى إدخال عنوان بريد إلكتروني صحيح' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        example: '1234567890',
    }),
    (0, class_validator_1.IsString)({ message: 'Phone number must be a string / رقم الهاتف يجب أن يكون نص' }),
    (0, class_validator_1.Matches)(/^[0-9]{8,15}$/, {
        message: 'Please provide a valid phone number / يرجى إدخال رقم هاتف صحيح',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password (min 8 chars, must contain uppercase, lowercase, and number)',
        example: 'MyPassword123',
        minLength: 8,
    }),
    (0, class_validator_1.IsString)({ message: 'Password must be a string / كلمة المرور يجب أن تكون نص' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters / كلمة المرور يجب أن تكون على الأقل 8 أحرف' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain uppercase, lowercase, and number / كلمة المرور يجب أن تحتوي على حروف كبيرة وصغيرة وأرقام',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confirm password (must match password)',
        example: 'MyPassword123',
    }),
    (0, class_validator_1.IsString)({ message: 'Confirm password must be a string / تأكيد كلمة المرور يجب أن يكون نص' }),
    IsPasswordConfirmed(),
    __metadata("design:type", String)
], RegisterDto.prototype, "confirmPassword", void 0);
//# sourceMappingURL=register.dto.js.map