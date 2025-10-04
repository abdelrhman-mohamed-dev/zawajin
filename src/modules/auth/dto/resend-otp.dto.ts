import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    description: 'Email address to resend OTP',
    example: 'an.roooof@gmail.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address / يرجى إدخال عنوان بريد إلكتروني صحيح' })
  email: string;
}