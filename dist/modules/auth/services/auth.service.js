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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const nestjs_i18n_1 = require("nestjs-i18n");
const bcrypt = require("bcrypt");
const user_repository_1 = require("../repositories/user.repository");
const otp_service_1 = require("./otp.service");
const mail_service_1 = require("../../mail/services/mail.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, otpService, mailService, jwtService, configService, i18n) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.mailService = mailService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.i18n = i18n;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.bcryptRounds = 12;
    }
    async register(dto) {
        this.logger.log(`Registration attempt for email: ${dto.email}`);
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            if (existingUser.isEmailVerified) {
                throw new common_1.ConflictException(this.i18n.t('auth.email_already_exists', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
            }
            this.logger.log(`Updating unverified user data for email: ${dto.email}`);
            if (dto.phone !== existingUser.phone) {
                const phoneUser = await this.userRepository.findByPhone(dto.phone);
                if (phoneUser && phoneUser.id !== existingUser.id) {
                    throw new common_1.ConflictException(this.i18n.t('auth.phone_already_exists', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
                }
            }
            const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);
            const updatedUserData = {
                fullName: dto.fullName,
                gender: dto.gender,
                passwordHash,
                phone: dto.phone,
                isEmailVerified: false,
                isPhoneVerified: false,
                isActive: true,
            };
            await this.userRepository.update(existingUser.id, updatedUserData);
            await this.otpService.deleteOtp(dto.email, otp_service_1.OtpType.EMAIL);
            const otpCode = await this.otpService.generateOtp(existingUser.id, dto.email, otp_service_1.OtpType.EMAIL);
            const emailSent = await this.mailService.sendOtpEmail(dto.email, otpCode);
            if (!emailSent) {
                this.logger.error(`Failed to send OTP email to ${dto.email}`);
                throw new common_1.BadRequestException(this.i18n.t('auth.failed_send_verification_email', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
            }
            this.logger.log(`User data updated and OTP resent for: ${existingUser.id}`);
            return {
                success: true,
                message: this.i18n.t('auth.registration_successful', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
                data: {
                    userId: existingUser.id,
                    email: dto.email,
                    chartNumber: existingUser.chartNumber,
                },
                timestamp: new Date().toISOString(),
            };
        }
        const phoneExists = await this.userRepository.isPhoneExists(dto.phone);
        if (phoneExists) {
            throw new common_1.ConflictException(this.i18n.t('auth.phone_already_exists', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);
        const userData = {
            fullName: dto.fullName,
            email: dto.email,
            gender: dto.gender,
            passwordHash,
            phone: dto.phone,
            isEmailVerified: false,
            isPhoneVerified: false,
            isActive: true,
        };
        const user = await this.userRepository.create(userData);
        const otpCode = await this.otpService.generateOtp(user.id, dto.email, otp_service_1.OtpType.EMAIL);
        const emailSent = await this.mailService.sendOtpEmail(dto.email, otpCode);
        if (!emailSent) {
            this.logger.error(`Failed to send OTP email to ${dto.email}`);
            throw new common_1.BadRequestException(this.i18n.t('auth.failed_send_verification_email', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        this.logger.log(`User registered successfully: ${user.id}`);
        return {
            success: true,
            message: this.i18n.t('auth.registration_successful', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
            data: {
                userId: user.id,
                email: user.email,
                chartNumber: user.chartNumber,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async verifyEmailOtp(email, code, fcmToken) {
        this.logger.log(`OTP verification attempt for email: ${email}`);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException(this.i18n.t('auth.user_not_found', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException(this.i18n.t('auth.email_already_verified', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        const validation = await this.otpService.validateOtp(email, code, otp_service_1.OtpType.EMAIL);
        if (!validation.isValid) {
            if (validation.attemptsExceeded) {
                throw new common_1.UnauthorizedException(this.i18n.t('auth.too_many_failed_attempts', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
            }
            throw new common_1.UnauthorizedException(this.i18n.t('auth.invalid_or_expired_otp', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        await this.userRepository.updateEmailVerified(user.id, true);
        if (fcmToken) {
            await this.userRepository.updateFcmToken(user.id, fcmToken);
        }
        const tokens = await this.generateTokens(user);
        await this.mailService.sendWelcomeEmail(user.email, user.fullName, user.chartNumber);
        this.logger.log(`Email verification successful for user: ${user.id}`);
        return {
            success: true,
            message: this.i18n.t('auth.email_verified_successfully', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
            data: {
                userId: user.id,
                email: user.email,
                isVerified: true,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async resendOtp(email) {
        this.logger.log(`OTP resend attempt for email: ${email}`);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException(this.i18n.t('auth.user_not_found', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException(this.i18n.t('auth.email_already_verified', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        await this.otpService.deleteOtp(email, otp_service_1.OtpType.EMAIL);
        const otpCode = await this.otpService.generateOtp(user.id, email, otp_service_1.OtpType.EMAIL);
        const emailSent = await this.mailService.sendOtpEmail(email, otpCode);
        if (!emailSent) {
            this.logger.error(`Failed to resend OTP email to ${email}`);
            throw new common_1.BadRequestException(this.i18n.t('auth.failed_send_verification_email', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        const expiresAt = await this.otpService.getOtpExpiry(email, otp_service_1.OtpType.EMAIL);
        this.logger.log(`OTP resent successfully to: ${email}`);
        return {
            success: true,
            message: this.i18n.t('auth.verification_code_sent', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
            data: {
                email,
                expiresAt,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async login(dto) {
        this.logger.log(`Login attempt for email: ${dto.email}`);
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException(this.i18n.t('auth.invalid_credentials', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException(this.i18n.t('auth.email_not_verified', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException(this.i18n.t('auth.account_deactivated', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException(this.i18n.t('auth.invalid_credentials', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        if (dto.fcmToken) {
            await this.userRepository.updateFcmToken(user.id, dto.fcmToken);
        }
        const tokens = await this.generateTokens(user);
        this.logger.log(`Login successful for user: ${user.id}`);
        return {
            success: true,
            message: this.i18n.t('auth.login_successful', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
            data: {
                userId: user.id,
                fullName: user.fullName,
                email: user.email,
                gender: user.gender,
                chartNumber: user.chartNumber,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
                termsAccepted: user.termsAccepted,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async forgetPassword(email) {
        this.logger.log(`Forget password request for email: ${email}`);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException(this.i18n.t('auth.user_not_found', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        if (!user.isEmailVerified) {
            throw new common_1.BadRequestException(this.i18n.t('auth.email_not_verified', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException(this.i18n.t('auth.account_deactivated', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        await this.otpService.deleteOtp(email, otp_service_1.OtpType.EMAIL);
        const otpCode = await this.otpService.generateOtp(user.id, email, otp_service_1.OtpType.EMAIL);
        const emailSent = await this.mailService.sendPasswordResetEmail(email, otpCode, user.fullName);
        if (!emailSent) {
            this.logger.error(`Failed to send password reset email to ${email}`);
            throw new common_1.BadRequestException(this.i18n.t('auth.failed_send_verification_email', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        const expiresAt = await this.otpService.getOtpExpiry(email, otp_service_1.OtpType.EMAIL);
        this.logger.log(`Password reset OTP sent successfully to: ${email}`);
        return {
            success: true,
            message: this.i18n.t('auth.password_reset_code_sent', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
            data: {
                email,
                expiresAt,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async verifyResetOtp(email, code) {
        this.logger.log(`Password reset OTP verification attempt for email: ${email}`);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException(this.i18n.t('auth.user_not_found', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        const validation = await this.otpService.validateOtp(email, code, otp_service_1.OtpType.EMAIL);
        if (!validation.isValid) {
            if (validation.attemptsExceeded) {
                throw new common_1.UnauthorizedException(this.i18n.t('auth.too_many_failed_attempts', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
            }
            throw new common_1.UnauthorizedException(this.i18n.t('auth.invalid_or_expired_otp', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        const tokens = await this.generateTokens(user);
        this.logger.log(`Password reset OTP verified successfully for: ${email}`);
        return {
            success: true,
            message: this.i18n.t('auth.otp_verified_successfully', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
            data: {
                email,
                isVerified: true,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async resetPassword(email, newPassword) {
        this.logger.log(`Password reset attempt for email: ${email}`);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException(this.i18n.t('auth.user_not_found', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        const passwordHash = await bcrypt.hash(newPassword, this.bcryptRounds);
        await this.userRepository.updatePassword(user.id, passwordHash);
        await this.otpService.deleteOtp(email, otp_service_1.OtpType.EMAIL);
        this.logger.log(`Password reset successful for user: ${user.id}`);
        return {
            success: true,
            message: this.i18n.t('auth.password_reset_successful', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
            timestamp: new Date().toISOString(),
        };
    }
    calculateProfileCompletion(user) {
        const profileFields = [
            { key: 'username', label: 'Username' },
            { key: 'dateOfBirth', label: 'Date of Birth' },
            { key: 'location', label: 'Location' },
            { key: 'tribe', label: 'Tribe' },
            { key: 'maritalStatus', label: 'Marital Status' },
            { key: 'educationLevel', label: 'Education Level' },
            { key: 'natureOfWork', label: 'Nature of Work' },
            { key: 'weight', label: 'Weight' },
            { key: 'height', label: 'Height' },
            { key: 'skinColor', label: 'Skin Color' },
            { key: 'beauty', label: 'Beauty' },
            { key: 'houseAvailable', label: 'House Available' },
            { key: 'bio', label: 'Bio' },
            { key: 'marriageType', label: 'Marriage Type' },
        ];
        const completedFields = [];
        const missingFields = [];
        profileFields.forEach(field => {
            const value = user[field.key];
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        completedFields.push(field.label);
                    }
                    else {
                        missingFields.push(field.label);
                    }
                }
                else if (typeof value === 'object') {
                    const hasValues = Object.values(value).some(v => v !== null && v !== undefined && v !== '');
                    if (hasValues) {
                        completedFields.push(field.label);
                    }
                    else {
                        missingFields.push(field.label);
                    }
                }
                else {
                    completedFields.push(field.label);
                }
            }
            else {
                missingFields.push(field.label);
            }
        });
        const totalFields = profileFields.length;
        const completedCount = completedFields.length;
        const percentage = Math.round((completedCount / totalFields) * 100);
        return {
            percentage,
            completedFields,
            missingFields,
        };
    }
    async acceptTerms(userId, termsAccepted) {
        this.logger.log(`Accept terms request for user: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(this.i18n.t('auth.user_not_found', { lang: nestjs_i18n_1.I18nContext.current()?.lang }));
        }
        await this.userRepository.update(userId, { termsAccepted });
        this.logger.log(`Terms acceptance status updated for user: ${userId}`);
        return {
            success: true,
            message: this.i18n.t('auth.terms_accepted_successfully', { lang: nestjs_i18n_1.I18nContext.current()?.lang }),
            data: {
                userId: user.id,
                termsAccepted,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            fullName: user.fullName,
            email: user.email,
            gender: user.gender,
            chartNumber: user.chartNumber,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
        };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get('JWT_EXPIRY', '7d'),
            secret: this.configService.get('JWT_SECRET'),
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: '30d',
            secret: this.configService.get('JWT_REFRESH_SECRET', this.configService.get('JWT_SECRET')),
        });
        return { access_token, refresh_token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        otp_service_1.OtpService,
        mail_service_1.MailService,
        jwt_1.JwtService,
        config_1.ConfigService,
        nestjs_i18n_1.I18nService])
], AuthService);
//# sourceMappingURL=auth.service.js.map