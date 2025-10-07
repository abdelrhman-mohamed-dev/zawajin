import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetOtpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'an.roooof@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: '6-digit OTP code received via email',
    example: '123456',
    minLength: 6,
    maxLength: 6,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'OTP code is required' })
  @Matches(/^\d{6}$/, { message: 'OTP code must be exactly 6 digits' })
  code: string;
}
