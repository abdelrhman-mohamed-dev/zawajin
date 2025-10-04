import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export enum OtpType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export interface OtpData {
  code: string;
  attempts: number;
  userId: string;
  type: OtpType;
  createdAt: Date;
}

@Injectable()
export class OtpService {
  private readonly otpLength: number;
  private readonly otpExpiryMinutes: number;
  private readonly maxAttempts: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.otpLength = this.configService.get<number>('OTP_LENGTH', 6);
    this.otpExpiryMinutes = this.configService.get<number>('OTP_EXPIRY_MINUTES', 5);
    this.maxAttempts = this.configService.get<number>('MAX_OTP_ATTEMPTS', 3);
  }

  async generateOtp(userId: string, identifier: string, type: OtpType): Promise<string> {
    const code = this.generateRandomCode();
    const key = this.getRedisKey(identifier, type);
    const ttl = this.otpExpiryMinutes * 60; // Convert to seconds

    const otpData: OtpData = {
      code,
      attempts: 0,
      userId,
      type,
      createdAt: new Date(),
    };

    await this.cacheManager.set(key, otpData, ttl);
    return code;
  }

  async validateOtp(identifier: string, code: string, type: OtpType): Promise<{ isValid: boolean; userId?: string; attemptsExceeded?: boolean }> {
    const key = this.getRedisKey(identifier, type);
    const otpData = await this.cacheManager.get<OtpData>(key);

    if (!otpData) {
      return { isValid: false };
    }

    if (otpData.attempts >= this.maxAttempts) {
      return { isValid: false, attemptsExceeded: true };
    }

    if (otpData.code !== code) {
      // Increment attempts
      otpData.attempts += 1;
      const ttl = this.otpExpiryMinutes * 60;
      await this.cacheManager.set(key, otpData, ttl);

      if (otpData.attempts >= this.maxAttempts) {
        return { isValid: false, attemptsExceeded: true };
      }

      return { isValid: false };
    }

    // OTP is valid - remove it from cache
    await this.cacheManager.del(key);
    return { isValid: true, userId: otpData.userId };
  }

  async getOtpData(identifier: string, type: OtpType): Promise<OtpData | null> {
    const key = this.getRedisKey(identifier, type);
    return await this.cacheManager.get<OtpData>(key);
  }

  async deleteOtp(identifier: string, type: OtpType): Promise<void> {
    const key = this.getRedisKey(identifier, type);
    await this.cacheManager.del(key);
  }

  async getOtpExpiry(identifier: string, type: OtpType): Promise<Date | null> {
    const otpData = await this.getOtpData(identifier, type);
    if (!otpData) return null;

    const expiryTime = new Date(otpData.createdAt);
    expiryTime.setMinutes(expiryTime.getMinutes() + this.otpExpiryMinutes);
    return expiryTime;
  }

  private generateRandomCode(): string {
    const min = Math.pow(10, this.otpLength - 1);
    const max = Math.pow(10, this.otpLength) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  private getRedisKey(identifier: string, type: OtpType): string {
    const prefix = type === OtpType.EMAIL ? 'otp:email' : 'otp:phone';
    return `${prefix}:${identifier}`;
  }
}