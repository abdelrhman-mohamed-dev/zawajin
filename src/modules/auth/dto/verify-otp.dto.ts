import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches, IsOptional } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email address to verify',
    example: 'an.roooof@gmail.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address / يرجى إدخال عنوان بريد إلكتروني صحيح' })
  email: string;

  @ApiProperty({
    description: '6-digit OTP code',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString({ message: 'OTP code must be a string / رمز التحقق يجب أن يكون نص' })
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits / رمز التحقق يجب أن يكون 6 أرقام بالضبط' })
  @Matches(/^\d{6}$/, {
    message: 'OTP code must contain only numbers / رمز التحقق يجب أن يحتوي على أرقام فقط',
  })
  code: string;

  @ApiProperty({
    description: 'FCM token for push notifications',
    example: 'fGhYvB2mQfKjdABC123...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'FCM token must be a string / رمز FCM يجب أن يكون نص' })
  fcmToken?: string;
}