import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
export declare enum OtpType {
    EMAIL = "EMAIL",
    PHONE = "PHONE"
}
export interface OtpData {
    code: string;
    attempts: number;
    userId: string;
    type: OtpType;
    createdAt: Date;
}
export declare class OtpService {
    private readonly cacheManager;
    private readonly configService;
    private readonly otpLength;
    private readonly otpExpiryMinutes;
    private readonly maxAttempts;
    constructor(cacheManager: Cache, configService: ConfigService);
    generateOtp(userId: string, identifier: string, type: OtpType): Promise<string>;
    validateOtp(identifier: string, code: string, type: OtpType): Promise<{
        isValid: boolean;
        userId?: string;
        attemptsExceeded?: boolean;
    }>;
    getOtpData(identifier: string, type: OtpType): Promise<OtpData | null>;
    deleteOtp(identifier: string, type: OtpType): Promise<void>;
    getOtpExpiry(identifier: string, type: OtpType): Promise<Date | null>;
    private generateRandomCode;
    private getRedisKey;
}
