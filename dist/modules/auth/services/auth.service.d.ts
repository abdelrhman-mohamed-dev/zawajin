import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserRepository } from '../repositories/user.repository';
import { OtpService } from './otp.service';
import { MailService } from '../../mail/services/mail.service';
import { RegisterResponse, VerifyResponse, ResendResponse, LoginResponse, ForgetPasswordResponse, VerifyResetOtpResponse, ResetPasswordResponse } from '../interfaces/auth.interface';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly otpService;
    private readonly mailService;
    private readonly jwtService;
    private readonly configService;
    private readonly i18n;
    private readonly logger;
    private readonly bcryptRounds;
    constructor(userRepository: UserRepository, otpService: OtpService, mailService: MailService, jwtService: JwtService, configService: ConfigService, i18n: I18nService);
    register(dto: RegisterDto): Promise<RegisterResponse>;
    verifyEmailOtp(email: string, code: string, fcmToken?: string): Promise<VerifyResponse>;
    resendOtp(email: string): Promise<ResendResponse>;
    login(dto: LoginDto): Promise<LoginResponse>;
    forgetPassword(email: string): Promise<ForgetPasswordResponse>;
    verifyResetOtp(email: string, code: string): Promise<VerifyResetOtpResponse>;
    resetPassword(email: string, newPassword: string): Promise<ResetPasswordResponse>;
    calculateProfileCompletion(user: User): {
        percentage: number;
        completedFields: string[];
        missingFields: string[];
    };
    acceptTerms(userId: string, termsAccepted: boolean): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: string;
            termsAccepted: boolean;
        };
        timestamp: string;
    }>;
    private generateTokens;
}
