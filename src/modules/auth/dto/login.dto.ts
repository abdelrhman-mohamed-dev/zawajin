import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'an.roooof@gmail.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address / يرجى إدخال عنوان بريد إلكتروني صحيح' })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'MySecurePassword123!',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string / كلمة المرور يجب أن تكون نص' })
  @MinLength(8, { message: 'Password must be at least 8 characters long / كلمة المرور يجب أن تكون على الأقل 8 أحرف' })
  password: string;

  @ApiProperty({
    description: 'FCM token for push notifications',
    example: 'fGhYvB2mQfKjdABC123...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'FCM token must be a string / رمز FCM يجب أن يكون نص' })
  fcmToken?: string;
}