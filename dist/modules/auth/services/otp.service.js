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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = exports.OtpType = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_manager_1 = require("@nestjs/cache-manager");
var OtpType;
(function (OtpType) {
    OtpType["EMAIL"] = "EMAIL";
    OtpType["PHONE"] = "PHONE";
})(OtpType || (exports.OtpType = OtpType = {}));
let OtpService = class OtpService {
    constructor(cacheManager, configService) {
        this.cacheManager = cacheManager;
        this.configService = configService;
        this.otpLength = this.configService.get('OTP_LENGTH', 6);
        this.otpExpiryMinutes = this.configService.get('OTP_EXPIRY_MINUTES', 5);
        this.maxAttempts = this.configService.get('MAX_OTP_ATTEMPTS', 3);
    }
    async generateOtp(userId, identifier, type) {
        const code = this.generateRandomCode();
        const key = this.getRedisKey(identifier, type);
        const ttl = this.otpExpiryMinutes * 60;
        const otpData = {
            code,
            attempts: 0,
            userId,
            type,
            createdAt: new Date(),
        };
        await this.cacheManager.set(key, otpData, ttl);
        return code;
    }
    async validateOtp(identifier, code, type) {
        const key = this.getRedisKey(identifier, type);
        const otpData = await this.cacheManager.get(key);
        if (!otpData) {
            return { isValid: false };
        }
        if (otpData.attempts >= this.maxAttempts) {
            return { isValid: false, attemptsExceeded: true };
        }
        if (otpData.code !== code) {
            otpData.attempts += 1;
            const ttl = this.otpExpiryMinutes * 60;
            await this.cacheManager.set(key, otpData, ttl);
            if (otpData.attempts >= this.maxAttempts) {
                return { isValid: false, attemptsExceeded: true };
            }
            return { isValid: false };
        }
        await this.cacheManager.del(key);
        return { isValid: true, userId: otpData.userId };
    }
    async getOtpData(identifier, type) {
        const key = this.getRedisKey(identifier, type);
        return await this.cacheManager.get(key);
    }
    async deleteOtp(identifier, type) {
        const key = this.getRedisKey(identifier, type);
        await this.cacheManager.del(key);
    }
    async getOtpExpiry(identifier, type) {
        const otpData = await this.getOtpData(identifier, type);
        if (!otpData)
            return null;
        const expiryTime = new Date(otpData.createdAt);
        expiryTime.setMinutes(expiryTime.getMinutes() + this.otpExpiryMinutes);
        return expiryTime;
    }
    generateRandomCode() {
        const min = Math.pow(10, this.otpLength - 1);
        const max = Math.pow(10, this.otpLength) - 1;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }
    getRedisKey(identifier, type) {
        const prefix = type === OtpType.EMAIL ? 'otp:email' : 'otp:phone';
        return `${prefix}:${identifier}`;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], OtpService);
//# sourceMappingURL=otp.service.js.map