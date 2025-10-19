import { I18nContext } from 'nestjs-i18n';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResendOtpDto } from '../dto/resend-otp.dto';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { VerifyResetOtpDto } from '../dto/verify-reset-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AcceptTermsDto } from '../dto/accept-terms.dto';
import { AuthService } from '../services/auth.service';
import { RegisterResponse, VerifyResponse, ResendResponse, LoginResponse, ForgetPasswordResponse, VerifyResetOtpResponse, ResetPasswordResponse } from '../interfaces/auth.interface';
import { UserRepository } from '../repositories/user.repository';
import { UserPresenceRepository } from '../../chat/repositories/user-presence.repository';
export declare class AuthController {
    private readonly authService;
    private readonly userRepository;
    private readonly userPresenceRepository;
    private readonly logger;
    constructor(authService: AuthService, userRepository: UserRepository, userPresenceRepository: UserPresenceRepository);
    private sanitizeNumericFields;
    register(registerDto: RegisterDto): Promise<RegisterResponse>;
    verifyEmail(verifyOtpDto: VerifyOtpDto): Promise<VerifyResponse>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<ResendResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<ForgetPasswordResponse>;
    verifyResetOtp(verifyResetOtpDto: VerifyResetOtpDto): Promise<VerifyResetOtpResponse>;
    resetPassword(resetPasswordDto: ResetPasswordDto, req: any): Promise<ResetPasswordResponse>;
    getCurrentUser(req: any, i18n: I18nContext): Promise<{
        success: boolean;
        message: string;
        data: any;
        timestamp: string;
    }>;
    acceptTerms(acceptTermsDto: AcceptTermsDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: string;
            termsAccepted: boolean;
        };
        timestamp: string;
    }>;
}
