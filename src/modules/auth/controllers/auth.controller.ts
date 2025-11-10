import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  HttpCode,
  Logger,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
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
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserRepository } from '../repositories/user.repository';
import { UserPresenceRepository } from '../../chat/repositories/user-presence.repository';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly userPresenceRepository: UserPresenceRepository,
  ) {}

  /**
   * Converts numeric fields to integers to remove .00 decimals
   */
  private sanitizeNumericFields(data: any): any {
    const numericFields = [
      'age', 'numberOfChildren', 'weight', 'height',
      'preferredAgeFrom', 'preferredAgeTo',
      'preferredMinWeight', 'preferredMaxWeight',
      'preferredMinHeight', 'preferredMaxHeight'
    ];

    const sanitized = { ...data };

    numericFields.forEach(field => {
      if (sanitized[field] !== null && sanitized[field] !== undefined) {
        sanitized[field] = Math.round(Number(sanitized[field]));
      }
    });

    return sanitized;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new user',
    description: 'Register a new user account with full name, gender, email, phone, and password. An OTP will be sent to the provided email address for verification.',
  })
  @ApiBody({
    type: RegisterDto,
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      this.logger.log(`Registration request for email: ${registerDto.email}`);
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error(`Registration failed for ${registerDto.email}:`, error.message);
      throw error;
    }
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify email with OTP',
    description: 'Verify user email address using the OTP code sent during registration. Optionally register FCM token for push notifications. Returns JWT tokens upon successful verification.',
  })
  @ApiBody({
    type: VerifyOtpDto,
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async verifyEmail(@Body() verifyOtpDto: VerifyOtpDto): Promise<VerifyResponse> {
    try {
      this.logger.log(`Email verification request for: ${verifyOtpDto.email}`);
      return await this.authService.verifyEmailOtp(verifyOtpDto.email, verifyOtpDto.code, verifyOtpDto.fcmToken);
    } catch (error) {
      this.logger.error(`Email verification failed for ${verifyOtpDto.email}:`, error.message);
      throw error;
    }
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend OTP code',
    description: 'Resend OTP verification code to the user email address. Previous OTP will be invalidated.',
  })
  @ApiBody({
    type: ResendOtpDto,
    description: 'Email address to resend OTP',
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto): Promise<ResendResponse> {
    try {
      this.logger.log(`OTP resend request for: ${resendOtpDto.email}`);
      return await this.authService.resendOtp(resendOtpDto.email);
    } catch (error) {
      this.logger.error(`OTP resend failed for ${resendOtpDto.email}:`, error.message);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Login with email and password. Optionally update FCM token for push notifications. Returns JWT tokens upon successful authentication.',
  })
  @ApiBody({
    type: LoginDto,
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
  })
  @ApiResponse({
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
          termsAccepted: false,
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    try {
      this.logger.log(`Login request for email: ${loginDto.email}`);
      return await this.authService.login(loginDto);
    } catch (error) {
      this.logger.error(`Login failed for ${loginDto.email}:`, error.message);
      throw error;
    }
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Request a password reset by providing your email address. A verification code will be sent to your email.',
  })
  @ApiBody({
    type: ForgetPasswordDto,
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto): Promise<ForgetPasswordResponse> {
    try {
      this.logger.log(`Forget password request for: ${forgetPasswordDto.email}`);
      return await this.authService.forgetPassword(forgetPasswordDto.email);
    } catch (error) {
      this.logger.error(`Forget password failed for ${forgetPasswordDto.email}:`, error.message);
      throw error;
    }
  }

  @Post('verify-reset-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify password reset OTP',
    description: 'Verify the OTP code sent to your email for password reset. This is step 2 of the password reset flow.',
  })
  @ApiBody({
    type: VerifyResetOtpDto,
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async verifyResetOtp(@Body() verifyResetOtpDto: VerifyResetOtpDto): Promise<VerifyResetOtpResponse> {
    try {
      this.logger.log(`Password reset OTP verification attempt for: ${verifyResetOtpDto.email}`);
      return await this.authService.verifyResetOtp(verifyResetOtpDto.email, verifyResetOtpDto.code);
    } catch (error) {
      this.logger.error(`Password reset OTP verification failed for ${verifyResetOtpDto.email}:`, error.message);
      throw error;
    }
  }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset your password with a new password. This is step 3 of the password reset flow. You must verify the OTP first using /verify-reset-otp endpoint to get the JWT token, then use that token in the Authorization header.',
  })
  @ApiBody({
    type: ResetPasswordDto,
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
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    schema: {
      example: {
        success: true,
        message: 'Password reset successful. You can now login with your new password',
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  @ApiResponse({
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
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Request() req): Promise<ResetPasswordResponse> {
    try {
      this.logger.log(`Password reset attempt for: ${resetPasswordDto.email}`);
      return await this.authService.resetPassword(
        resetPasswordDto.email,
        resetPasswordDto.newPassword
      );
    } catch (error) {
      this.logger.error(`Password reset failed for ${resetPasswordDto.email}:`, error.message);
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current authenticated user with profile completion',
    description: 'Get the profile information of the currently authenticated user using JWT token. Returns user data along with profile completion percentage, completed fields, and missing fields to help users complete their profile.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully with profile completion percentage and missing fields',
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
          isOnline: true,
          lastSeenAt: '2024-01-01T12:30:00.000Z',
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
          updatedAt: '2024-01-01T00:00:00.000Z',
          profileCompletion: {
            percentage: 47,
            completedFields: [
              'Age',
              'Location',
              'Marital Status',
              'Profession',
              'Bio',
              'Religious Practice',
              'Sect',
              'Prayer Level'
            ],
            missingFields: [
              'Date of Birth',
              'Origin',
              'Weight',
              'Height',
              'Body Color',
              'Hair Color',
              'Hair Type',
              'Eye Color',
              'House Available',
              'Nature of Work',
              'Preferred Min Weight',
              'Preferred Max Weight',
              'Preferred Min Height',
              'Preferred Max Height',
              'Preferred Body Colors',
              'Preferred Hair Colors',
              'Preferred Eye Colors',
              'Partner Preferences Bio',
              'Marriage Type',
              'Accept Polygamy'
            ]
          }
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
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
  })
  async getCurrentUser(@Request() req, @I18n() i18n: I18nContext) {
    try {
      this.logger.log(`Get current user request for: ${req.user.sub}`);
      const user = await this.userRepository.findById(req.user.sub);

      // Calculate profile completion
      const profileCompletion = this.authService.calculateProfileCompletion(user);

      // Get online status from user presence
      // Check if user has an active socket connection by verifying presence record
      const presence = await this.userPresenceRepository.getUserPresence(req.user.sub);
      // User is online only if they have a presence record with isOnline=true and an active socketId
      const isOnline = presence ? (presence.isOnline && !!presence.socketId) : false;
      const lastSeenAt = presence ? presence.lastSeenAt : user.createdAt;

      // Remove sensitive data
      const { passwordHash, fcmToken, ...userWithoutSensitiveData } = user;

      // Sanitize numeric fields
      const sanitizedUser = this.sanitizeNumericFields(userWithoutSensitiveData);

      return {
        success: true,
        message: await i18n.t('auth.user_profile_retrieved'),
        data: {
          ...sanitizedUser,
          isOnline,
          lastSeenAt,
          profileCompletion,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Get current user failed for ${req.user.sub}:`, error.message);
      throw error;
    }
  }

  @Post('accept-terms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accept terms and policies',
    description: 'Mark that the user has accepted the terms and conditions and privacy policy.',
  })
  @ApiBody({
    type: AcceptTermsDto,
    description: 'Terms acceptance status',
    examples: {
      acceptTerms: {
        summary: 'Accept terms',
        description: 'User accepts terms and policies',
        value: {
          termsAccepted: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Terms accepted successfully',
    schema: {
      example: {
        success: true,
        message: 'Terms and policies accepted successfully',
        data: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          termsAccepted: true
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        error: {
          code: 'VALIDATION_ERROR',
          details: ['Terms acceptance must be true or false']
        },
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  async acceptTerms(@Body() acceptTermsDto: AcceptTermsDto, @Request() req) {
    try {
      this.logger.log(`Accept terms request for user: ${req.user.sub}`);
      return await this.authService.acceptTerms(req.user.sub, acceptTermsDto.termsAccepted);
    } catch (error) {
      this.logger.error(`Accept terms failed for ${req.user.sub}:`, error.message);
      throw error;
    }
  }
}