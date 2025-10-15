import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { I18nContext, I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserRepository } from '../repositories/user.repository';
import { OtpService, OtpType } from './otp.service';
import { MailService } from '../../mail/services/mail.service';
import { RegisterResponse, VerifyResponse, ResendResponse, LoginResponse, ForgetPasswordResponse, VerifyResetOtpResponse, ResetPasswordResponse } from '../interfaces/auth.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly bcryptRounds = 12;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    this.logger.log(`Registration attempt for email: ${dto.email}`);

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      // If email is verified, don't allow re-registration
      if (existingUser.isEmailVerified) {
        throw new ConflictException(
          this.i18n.t('auth.email_already_exists', { lang: I18nContext.current()?.lang })
        );
      }

      // If email is not verified, update the user data and resend OTP
      this.logger.log(`Updating unverified user data for email: ${dto.email}`);

      // Check if phone already exists for a different user
      if (dto.phone !== existingUser.phone) {
        const phoneUser = await this.userRepository.findByPhone(dto.phone);
        if (phoneUser && phoneUser.id !== existingUser.id) {
          throw new ConflictException(
            this.i18n.t('auth.phone_already_exists', { lang: I18nContext.current()?.lang })
          );
        }
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);

      // Update user with new data
      const updatedUserData: Partial<User> = {
        fullName: dto.fullName,
        gender: dto.gender,
        passwordHash,
        phone: dto.phone,
        isEmailVerified: false,
        isPhoneVerified: false,
        isActive: true,
      };

      await this.userRepository.update(existingUser.id, updatedUserData);

      // Delete existing OTP if any
      await this.otpService.deleteOtp(dto.email, OtpType.EMAIL);

      // Generate and send new OTP
      const otpCode = await this.otpService.generateOtp(existingUser.id, dto.email, OtpType.EMAIL);
      const emailSent = await this.mailService.sendOtpEmail(dto.email, otpCode);

      if (!emailSent) {
        this.logger.error(`Failed to send OTP email to ${dto.email}`);
        throw new BadRequestException(
          this.i18n.t('auth.failed_send_verification_email', { lang: I18nContext.current()?.lang })
        );
      }

      this.logger.log(`User data updated and OTP resent for: ${existingUser.id}`);

      return {
        success: true,
        message: this.i18n.t('auth.registration_successful', { lang: I18nContext.current()?.lang }),
        data: {
          userId: existingUser.id,
          email: dto.email,
          chartNumber: existingUser.chartNumber,
        },
        timestamp: new Date().toISOString(),
      };
    }

    // Check if phone already exists for new registrations
    const phoneExists = await this.userRepository.isPhoneExists(dto.phone);
    if (phoneExists) {
      throw new ConflictException(
        this.i18n.t('auth.phone_already_exists', { lang: I18nContext.current()?.lang })
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);

    // Create user
    const userData: Partial<User> = {
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

    // Generate and send OTP
    const otpCode = await this.otpService.generateOtp(user.id, dto.email, OtpType.EMAIL);
    const emailSent = await this.mailService.sendOtpEmail(dto.email, otpCode);

    if (!emailSent) {
      this.logger.error(`Failed to send OTP email to ${dto.email}`);
      throw new BadRequestException(
        this.i18n.t('auth.failed_send_verification_email', { lang: I18nContext.current()?.lang })
      );
    }

    this.logger.log(`User registered successfully: ${user.id}`);

    return {
      success: true,
      message: this.i18n.t('auth.registration_successful', { lang: I18nContext.current()?.lang }),
      data: {
        userId: user.id,
        email: user.email,
        chartNumber: user.chartNumber,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async verifyEmailOtp(email: string, code: string, fcmToken?: string): Promise<VerifyResponse> {
    this.logger.log(`OTP verification attempt for email: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('auth.user_not_found', { lang: I18nContext.current()?.lang })
      );
    }

    if (user.isEmailVerified) {
      throw new BadRequestException(
        this.i18n.t('auth.email_already_verified', { lang: I18nContext.current()?.lang })
      );
    }

    const validation = await this.otpService.validateOtp(email, code, OtpType.EMAIL);

    if (!validation.isValid) {
      if (validation.attemptsExceeded) {
        throw new UnauthorizedException(
          this.i18n.t('auth.too_many_failed_attempts', { lang: I18nContext.current()?.lang })
        );
      }
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_or_expired_otp', { lang: I18nContext.current()?.lang })
      );
    }

    // Mark user as email verified
    await this.userRepository.updateEmailVerified(user.id, true);

    // Update FCM token if provided
    if (fcmToken) {
      await this.userRepository.updateFcmToken(user.id, fcmToken);
    }

    // Generate JWT tokens
    const tokens = await this.generateTokens(user);

    // Send welcome email
    await this.mailService.sendWelcomeEmail(user.email, user.fullName, user.chartNumber);

    this.logger.log(`Email verification successful for user: ${user.id}`);

    return {
      success: true,
      message: this.i18n.t('auth.email_verified_successfully', { lang: I18nContext.current()?.lang }),
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

  async resendOtp(email: string): Promise<ResendResponse> {
    this.logger.log(`OTP resend attempt for email: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('auth.user_not_found', { lang: I18nContext.current()?.lang })
      );
    }

    if (user.isEmailVerified) {
      throw new BadRequestException(
        this.i18n.t('auth.email_already_verified', { lang: I18nContext.current()?.lang })
      );
    }

    // Delete existing OTP
    await this.otpService.deleteOtp(email, OtpType.EMAIL);

    // Generate new OTP
    const otpCode = await this.otpService.generateOtp(user.id, email, OtpType.EMAIL);
    const emailSent = await this.mailService.sendOtpEmail(email, otpCode);

    if (!emailSent) {
      this.logger.error(`Failed to resend OTP email to ${email}`);
      throw new BadRequestException(
        this.i18n.t('auth.failed_send_verification_email', { lang: I18nContext.current()?.lang })
      );
    }

    const expiresAt = await this.otpService.getOtpExpiry(email, OtpType.EMAIL);

    this.logger.log(`OTP resent successfully to: ${email}`);

    return {
      success: true,
      message: this.i18n.t('auth.verification_code_sent', { lang: I18nContext.current()?.lang }),
      data: {
        email,
        expiresAt,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    this.logger.log(`Login attempt for email: ${dto.email}`);

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_credentials', { lang: I18nContext.current()?.lang })
      );
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        this.i18n.t('auth.email_not_verified', { lang: I18nContext.current()?.lang })
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        this.i18n.t('auth.account_deactivated', { lang: I18nContext.current()?.lang })
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_credentials', { lang: I18nContext.current()?.lang })
      );
    }

    // Update FCM token if provided
    if (dto.fcmToken) {
      await this.userRepository.updateFcmToken(user.id, dto.fcmToken);
    }

    // Generate JWT tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`Login successful for user: ${user.id}`);

    return {
      success: true,
      message: this.i18n.t('auth.login_successful', { lang: I18nContext.current()?.lang }),
      data: {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
        chartNumber: user.chartNumber,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async forgetPassword(email: string): Promise<ForgetPasswordResponse> {
    this.logger.log(`Forget password request for email: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('auth.user_not_found', { lang: I18nContext.current()?.lang })
      );
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException(
        this.i18n.t('auth.email_not_verified', { lang: I18nContext.current()?.lang })
      );
    }

    if (!user.isActive) {
      throw new BadRequestException(
        this.i18n.t('auth.account_deactivated', { lang: I18nContext.current()?.lang })
      );
    }

    // Delete existing OTP if any
    await this.otpService.deleteOtp(email, OtpType.EMAIL);

    // Generate and send new OTP for password reset
    const otpCode = await this.otpService.generateOtp(user.id, email, OtpType.EMAIL);
    const emailSent = await this.mailService.sendPasswordResetEmail(email, otpCode, user.fullName);

    if (!emailSent) {
      this.logger.error(`Failed to send password reset email to ${email}`);
      throw new BadRequestException(
        this.i18n.t('auth.failed_send_verification_email', { lang: I18nContext.current()?.lang })
      );
    }

    const expiresAt = await this.otpService.getOtpExpiry(email, OtpType.EMAIL);

    this.logger.log(`Password reset OTP sent successfully to: ${email}`);

    return {
      success: true,
      message: this.i18n.t('auth.password_reset_code_sent', { lang: I18nContext.current()?.lang }),
      data: {
        email,
        expiresAt,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async verifyResetOtp(email: string, code: string): Promise<VerifyResetOtpResponse> {
    this.logger.log(`Password reset OTP verification attempt for email: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('auth.user_not_found', { lang: I18nContext.current()?.lang })
      );
    }

    // Validate OTP
    const validation = await this.otpService.validateOtp(email, code, OtpType.EMAIL);

    if (!validation.isValid) {
      if (validation.attemptsExceeded) {
        throw new UnauthorizedException(
          this.i18n.t('auth.too_many_failed_attempts', { lang: I18nContext.current()?.lang })
        );
      }
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_or_expired_otp', { lang: I18nContext.current()?.lang })
      );
    }

    // Generate JWT tokens for password reset
    const tokens = await this.generateTokens(user);

    this.logger.log(`Password reset OTP verified successfully for: ${email}`);

    return {
      success: true,
      message: this.i18n.t('auth.otp_verified_successfully', { lang: I18nContext.current()?.lang }),
      data: {
        email,
        isVerified: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async resetPassword(email: string, newPassword: string): Promise<ResetPasswordResponse> {
    this.logger.log(`Password reset attempt for email: ${email}`);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('auth.user_not_found', { lang: I18nContext.current()?.lang })
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, this.bcryptRounds);

    // Update user password
    await this.userRepository.updatePassword(user.id, passwordHash);

    // Delete OTP after successful password reset
    await this.otpService.deleteOtp(email, OtpType.EMAIL);

    this.logger.log(`Password reset successful for user: ${user.id}`);

    return {
      success: true,
      message: this.i18n.t('auth.password_reset_successful', { lang: I18nContext.current()?.lang }),
      timestamp: new Date().toISOString(),
    };
  }

  calculateProfileCompletion(user: User): {
    percentage: number;
    completedFields: string[];
    missingFields: string[];
  } {
    // Define all profile fields that should be filled
    const profileFields = [
      // Basic Info
      { key: 'dateOfBirth', label: 'Date of Birth' },
      { key: 'age', label: 'Age' },
      { key: 'location', label: 'Location' },
      { key: 'origin', label: 'Origin' },
      { key: 'maritalStatus', label: 'Marital Status' },
      { key: 'profession', label: 'Profession' },

      // Physical Attributes
      { key: 'weight', label: 'Weight' },
      { key: 'height', label: 'Height' },
      { key: 'bodyColor', label: 'Body Color' },
      { key: 'hairColor', label: 'Hair Color' },
      { key: 'hairType', label: 'Hair Type' },
      { key: 'eyeColor', label: 'Eye Color' },
      { key: 'houseAvailable', label: 'House Available' },
      { key: 'natureOfWork', label: 'Nature of Work' },
      { key: 'bio', label: 'Bio' },

      // Religious Info
      { key: 'religiousPractice', label: 'Religious Practice' },
      { key: 'sect', label: 'Sect' },
      { key: 'prayerLevel', label: 'Prayer Level' },

      // Partner Preferences
      { key: 'preferredMinWeight', label: 'Preferred Min Weight' },
      { key: 'preferredMaxWeight', label: 'Preferred Max Weight' },
      { key: 'preferredMinHeight', label: 'Preferred Min Height' },
      { key: 'preferredMaxHeight', label: 'Preferred Max Height' },
      { key: 'preferredBodyColors', label: 'Preferred Body Colors' },
      { key: 'preferredHairColors', label: 'Preferred Hair Colors' },
      { key: 'preferredEyeColors', label: 'Preferred Eye Colors' },
      { key: 'partnerPreferencesBio', label: 'Partner Preferences Bio' },

      // Marriage Preferences
      { key: 'marriageType', label: 'Marriage Type' },
      { key: 'acceptPolygamy', label: 'Accept Polygamy' },
    ];

    const completedFields: string[] = [];
    const missingFields: string[] = [];

    profileFields.forEach(field => {
      const value = user[field.key];

      // Check if field is filled
      if (value !== null && value !== undefined && value !== '') {
        // For arrays, check if they have at least one element
        if (Array.isArray(value)) {
          if (value.length > 0) {
            completedFields.push(field.label);
          } else {
            missingFields.push(field.label);
          }
        }
        // For objects (like location), check if they have properties
        else if (typeof value === 'object') {
          const hasValues = Object.values(value).some(v => v !== null && v !== undefined && v !== '');
          if (hasValues) {
            completedFields.push(field.label);
          } else {
            missingFields.push(field.label);
          }
        }
        // For primitive values
        else {
          completedFields.push(field.label);
        }
      } else {
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

  private async generateTokens(user: User): Promise<{ access_token: string; refresh_token: string }> {
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
      expiresIn: this.configService.get<string>('JWT_EXPIRY', '7d'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', this.configService.get<string>('JWT_SECRET')),
    });

    return { access_token, refresh_token };
  }
}