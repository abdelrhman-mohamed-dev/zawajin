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
import { Throttle } from '@nestjs/throttler';
import { I18n, I18nContext } from 'nestjs-i18n';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResendOtpDto } from '../dto/resend-otp.dto';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthService } from '../services/auth.service';
import { RegisterResponse, VerifyResponse, ResendResponse, LoginResponse, ForgetPasswordResponse, ResetPasswordResponse } from '../interfaces/auth.interface';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserRepository } from '../repositories/user.repository';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 requests per hour
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
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 requests per hour
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
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour per email
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
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 requests per hour
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
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour
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

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 requests per hour
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset your password using the verification code sent to your email.',
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'Email, OTP code, and new password',
    examples: {
      resetPassword: {
        summary: 'Reset password',
        description: 'Provide email, OTP code, and new password to reset your password',
        value: {
          email: 'an.roooof@gmail.com',
          code: '123456',
          newPassword: 'NewPassword123'
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
    description: 'Invalid input data',
    schema: {
      example: {
        success: false,
        message: 'Validation failed',
        error: {
          code: 'VALIDATION_ERROR',
          details: ['Password must be at least 8 characters long']
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
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    try {
      this.logger.log(`Password reset attempt for: ${resetPasswordDto.email}`);
      return await this.authService.resetPassword(
        resetPasswordDto.email,
        resetPasswordDto.code,
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
    summary: 'Get current authenticated user',
    description: 'Get the profile information of the currently authenticated user using JWT token.',
  })
  @ApiResponse({
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

      // Remove sensitive data
      const { passwordHash, fcmToken, ...userWithoutSensitiveData } = user;

      return {
        success: true,
        message: await i18n.t('auth.user_profile_retrieved'),
        data: userWithoutSensitiveData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Get current user failed for ${req.user.sub}:`, error.message);
      throw error;
    }
  }
}