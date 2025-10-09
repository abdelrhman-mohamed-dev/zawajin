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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const nestjs_i18n_1 = require("nestjs-i18n");
const register_dto_1 = require("../dto/register.dto");
const login_dto_1 = require("../dto/login.dto");
const verify_otp_dto_1 = require("../dto/verify-otp.dto");
const resend_otp_dto_1 = require("../dto/resend-otp.dto");
const forget_password_dto_1 = require("../dto/forget-password.dto");
const verify_reset_otp_dto_1 = require("../dto/verify-reset-otp.dto");
const reset_password_dto_1 = require("../dto/reset-password.dto");
const auth_service_1 = require("../services/auth.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const user_repository_1 = require("../repositories/user.repository");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService, userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async register(registerDto) {
        try {
            this.logger.log(`Registration request for email: ${registerDto.email}`);
            return await this.authService.register(registerDto);
        }
        catch (error) {
            this.logger.error(`Registration failed for ${registerDto.email}:`, error.message);
            throw error;
        }
    }
    async verifyEmail(verifyOtpDto) {
        try {
            this.logger.log(`Email verification request for: ${verifyOtpDto.email}`);
            return await this.authService.verifyEmailOtp(verifyOtpDto.email, verifyOtpDto.code, verifyOtpDto.fcmToken);
        }
        catch (error) {
            this.logger.error(`Email verification failed for ${verifyOtpDto.email}:`, error.message);
            throw error;
        }
    }
    async resendOtp(resendOtpDto) {
        try {
            this.logger.log(`OTP resend request for: ${resendOtpDto.email}`);
            return await this.authService.resendOtp(resendOtpDto.email);
        }
        catch (error) {
            this.logger.error(`OTP resend failed for ${resendOtpDto.email}:`, error.message);
            throw error;
        }
    }
    async login(loginDto) {
        try {
            this.logger.log(`Login request for email: ${loginDto.email}`);
            return await this.authService.login(loginDto);
        }
        catch (error) {
            this.logger.error(`Login failed for ${loginDto.email}:`, error.message);
            throw error;
        }
    }
    async forgetPassword(forgetPasswordDto) {
        try {
            this.logger.log(`Forget password request for: ${forgetPasswordDto.email}`);
            return await this.authService.forgetPassword(forgetPasswordDto.email);
        }
        catch (error) {
            this.logger.error(`Forget password failed for ${forgetPasswordDto.email}:`, error.message);
            throw error;
        }
    }
    async verifyResetOtp(verifyResetOtpDto) {
        try {
            this.logger.log(`Password reset OTP verification attempt for: ${verifyResetOtpDto.email}`);
            return await this.authService.verifyResetOtp(verifyResetOtpDto.email, verifyResetOtpDto.code);
        }
        catch (error) {
            this.logger.error(`Password reset OTP verification failed for ${verifyResetOtpDto.email}:`, error.message);
            throw error;
        }
    }
    async resetPassword(resetPasswordDto, req) {
        try {
            this.logger.log(`Password reset attempt for: ${resetPasswordDto.email}`);
            return await this.authService.resetPassword(resetPasswordDto.email, resetPasswordDto.newPassword);
        }
        catch (error) {
            this.logger.error(`Password reset failed for ${resetPasswordDto.email}:`, error.message);
            throw error;
        }
    }
    async getCurrentUser(req, i18n) {
        try {
            this.logger.log(`Get current user request for: ${req.user.sub}`);
            const user = await this.userRepository.findById(req.user.sub);
            const { passwordHash, fcmToken, ...userWithoutSensitiveData } = user;
            return {
                success: true,
                message: await i18n.t('auth.user_profile_retrieved'),
                data: userWithoutSensitiveData,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`Get current user failed for ${req.user.sub}:`, error.message);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Register new user',
        description: 'Register a new user account with full name, gender, email, phone, and password. An OTP will be sent to the provided email address for verification.',
    }),
    (0, swagger_1.ApiBody)({
        type: register_dto_1.RegisterDto,
        description: 'User registration data',
        examples: {
            registration: {
                summary: 'User Registration',
                description: 'Complete user registration with all required fields',
                value: {
                    fullName: 'أحمد محمد علي',
                    gender: 'male',
                    email: 'ahmed@example.com',
                    phone: '1234567890',
                    password: 'MyPassword123',
                    confirmPassword: 'MyPassword123'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully. OTP sent to email.',
        schema: {
            example: {
                success: true,
                message: 'Registration successful. Please check your email for verification code',
                data: {
                    userId: '123e4567-e89b-12d3-a456-426614174000',
                    email: 'an.roooof@gmail.com',
                    chartNumber: 'ZX-545654',
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Email or phone already exists',
        schema: {
            example: {
                success: false,
                message: 'Email already exists',
                error: {
                    code: 'CONFLICT_ERROR',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
        schema: {
            example: {
                success: false,
                message: 'Validation failed',
                error: {
                    code: 'VALIDATION_ERROR',
                    details: ['Full name must be at least 2 characters']
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many registration attempts',
        schema: {
            example: {
                success: false,
                message: 'Too many requests',
                error: {
                    code: 'RATE_LIMIT_ERROR',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify email with OTP',
        description: 'Verify user email address using the OTP code sent during registration. Optionally register FCM token for push notifications. Returns JWT tokens upon successful verification.',
    }),
    (0, swagger_1.ApiBody)({
        type: verify_otp_dto_1.VerifyOtpDto,
        description: 'Email, OTP verification data, and optional FCM token',
        examples: {
            withFcmToken: {
                summary: 'Verify OTP with FCM token',
                description: 'Verify email with OTP and register FCM token for push notifications',
                value: {
                    email: 'an.roooof@gmail.com',
                    code: '123456',
                    fcmToken: 'fGhYvB2mQfKjdABC123456789...'
                }
            },
            withoutFcmToken: {
                summary: 'Verify OTP without FCM token',
                description: 'Verify email with OTP only',
                value: {
                    email: 'an.roooof@gmail.com',
                    code: '123456'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email verified successfully. JWT tokens returned.',
        schema: {
            example: {
                success: true,
                message: 'Email verified successfully',
                data: {
                    userId: '123e4567-e89b-12d3-a456-426614174000',
                    email: 'an.roooof@gmail.com',
                    isVerified: true,
                    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired OTP code',
        schema: {
            example: {
                success: false,
                message: 'Invalid or expired OTP code',
                error: {
                    code: 'UNAUTHORIZED',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
        schema: {
            example: {
                success: false,
                message: 'User not found',
                error: {
                    code: 'NOT_FOUND',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Email already verified',
        schema: {
            example: {
                success: false,
                message: 'Email already verified',
                error: {
                    code: 'BAD_REQUEST',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many verification attempts',
        schema: {
            example: {
                success: false,
                message: 'Too many requests',
                error: {
                    code: 'RATE_LIMIT_ERROR',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Resend OTP code',
        description: 'Resend OTP verification code to the user email address. Previous OTP will be invalidated.',
    }),
    (0, swagger_1.ApiBody)({
        type: resend_otp_dto_1.ResendOtpDto,
        description: 'Email address to resend OTP',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP resent successfully',
        schema: {
            example: {
                success: true,
                message: 'Verification code sent successfully',
                data: {
                    email: 'an.roooof@gmail.com',
                    expiresAt: '2024-01-01T00:05:00.000Z',
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
        schema: {
            example: {
                success: false,
                message: 'User not found',
                error: {
                    code: 'NOT_FOUND',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Email already verified or failed to send email',
        schema: {
            example: {
                success: false,
                message: 'Email already verified',
                error: {
                    code: 'BAD_REQUEST',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many resend attempts',
        schema: {
            example: {
                success: false,
                message: 'Too many requests',
                error: {
                    code: 'RATE_LIMIT_ERROR',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_otp_dto_1.ResendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Login with email and password. Optionally update FCM token for push notifications. Returns JWT tokens upon successful authentication.',
    }),
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
        description: 'User login credentials and optional FCM token',
        examples: {
            withFcmToken: {
                summary: 'Login with FCM token',
                description: 'Login with email, password, and FCM token for push notifications',
                value: {
                    email: 'an.roooof@gmail.com',
                    password: 'MySecurePassword123!',
                    fcmToken: 'fGhYvB2mQfKjdABC123456789...'
                }
            },
            withoutFcmToken: {
                summary: 'Login without FCM token',
                description: 'Login with email and password only',
                value: {
                    email: 'an.roooof@gmail.com',
                    password: 'MySecurePassword123!'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login successful. JWT tokens returned.',
        schema: {
            example: {
                success: true,
                message: 'Login successful',
                data: {
                    userId: '123e4567-e89b-12d3-a456-426614174000',
                    fullName: 'أحمد محمد علي',
                    email: 'an.roooof@gmail.com',
                    gender: 'male',
                    chartNumber: 'ZX-545654',
                    isEmailVerified: true,
                    isPhoneVerified: false,
                    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials or email not verified',
        schema: {
            example: {
                success: false,
                message: 'Invalid credentials',
                error: {
                    code: 'UNAUTHORIZED',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many login attempts',
        schema: {
            example: {
                success: false,
                message: 'Too many requests',
                error: {
                    code: 'RATE_LIMIT_ERROR',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forget-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Request password reset',
        description: 'Request a password reset by providing your email address. A verification code will be sent to your email.',
    }),
    (0, swagger_1.ApiBody)({
        type: forget_password_dto_1.ForgetPasswordDto,
        description: 'Email address for password reset',
        examples: {
            forgetPassword: {
                summary: 'Request password reset',
                description: 'Provide your email to receive a password reset code',
                value: {
                    email: 'an.roooof@gmail.com'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset code sent successfully',
        schema: {
            example: {
                success: true,
                message: 'Password reset code sent successfully. Please check your email',
                data: {
                    email: 'an.roooof@gmail.com',
                    expiresAt: '2024-01-01T00:05:00.000Z',
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
        schema: {
            example: {
                success: false,
                message: 'User not found',
                error: {
                    code: 'NOT_FOUND',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Email not verified or account deactivated',
        schema: {
            example: {
                success: false,
                message: 'Email not verified. Please verify your email first',
                error: {
                    code: 'BAD_REQUEST',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many password reset requests',
        schema: {
            example: {
                success: false,
                message: 'Too many requests',
                error: {
                    code: 'RATE_LIMIT_ERROR',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forget_password_dto_1.ForgetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)('verify-reset-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify password reset OTP',
        description: 'Verify the OTP code sent to your email for password reset. This is step 2 of the password reset flow.',
    }),
    (0, swagger_1.ApiBody)({
        type: verify_reset_otp_dto_1.VerifyResetOtpDto,
        description: 'Email and OTP code',
        examples: {
            verifyResetOtp: {
                summary: 'Verify password reset OTP',
                description: 'Provide email and OTP code to verify before resetting password',
                value: {
                    email: 'an.roooof@gmail.com',
                    code: '123456'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP verified successfully. JWT tokens returned.',
        schema: {
            example: {
                success: true,
                message: 'OTP verified successfully. You can now reset your password',
                data: {
                    email: 'an.roooof@gmail.com',
                    isVerified: true,
                    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired OTP code',
        schema: {
            example: {
                success: false,
                message: 'Invalid or expired OTP code',
                error: {
                    code: 'UNAUTHORIZED',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
        schema: {
            example: {
                success: false,
                message: 'User not found',
                error: {
                    code: 'NOT_FOUND',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many verification attempts',
        schema: {
            example: {
                success: false,
                message: 'Too many requests',
                error: {
                    code: 'RATE_LIMIT_ERROR',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_reset_otp_dto_1.VerifyResetOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetOtp", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 3600000 } }),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset password',
        description: 'Reset your password with a new password. This is step 3 of the password reset flow. You must verify the OTP first using /verify-reset-otp endpoint to get the JWT token, then use that token in the Authorization header.',
    }),
    (0, swagger_1.ApiBody)({
        type: reset_password_dto_1.ResetPasswordDto,
        description: 'Email, new password, and confirm password',
        examples: {
            resetPassword: {
                summary: 'Reset password',
                description: 'Provide email, new password, and confirm password to reset your password',
                value: {
                    email: 'an.roooof@gmail.com',
                    newPassword: 'NewPassword123',
                    confirmPassword: 'NewPassword123'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password reset successful',
        schema: {
            example: {
                success: true,
                message: 'Password reset successful. You can now login with your new password',
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
        schema: {
            example: {
                success: false,
                message: 'User not found',
                error: {
                    code: 'NOT_FOUND',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or passwords do not match',
        schema: {
            example: {
                success: false,
                message: 'Validation failed',
                error: {
                    code: 'VALIDATION_ERROR',
                    details: ['Password must be at least 8 characters long', 'Passwords do not match']
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token',
        schema: {
            example: {
                success: false,
                message: 'Unauthorized',
                error: {
                    code: 'UNAUTHORIZED',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too many password reset attempts',
        schema: {
            example: {
                success: false,
                message: 'Too many requests',
                error: {
                    code: 'RATE_LIMIT_ERROR',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current authenticated user',
        description: 'Get the profile information of the currently authenticated user using JWT token.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile retrieved successfully',
        schema: {
            example: {
                success: true,
                message: 'User profile retrieved successfully',
                data: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    fullName: 'أحمد محمد علي',
                    email: 'ahmed@example.com',
                    gender: 'male',
                    phone: '1234567890',
                    chartNumber: 'ZX-545654',
                    isEmailVerified: true,
                    isPhoneVerified: false,
                    bio: 'A kind and practicing Muslim looking for a life partner.',
                    age: 30,
                    location: {
                        city: 'Dubai',
                        country: 'UAE'
                    },
                    religiousPractice: 'Religious',
                    sect: 'Sunni',
                    prayerLevel: 'Prays 5 times a day',
                    maritalStatus: 'single',
                    profession: 'Software Engineer',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z'
                },
                timestamp: '2024-01-01T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token',
        schema: {
            example: {
                success: false,
                message: 'Unauthorized',
                error: {
                    code: 'UNAUTHORIZED',
                    details: []
                },
                timestamp: '2024-01-01T00:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_repository_1.UserRepository])
], AuthController);
//# sourceMappingURL=auth.controller.js.map