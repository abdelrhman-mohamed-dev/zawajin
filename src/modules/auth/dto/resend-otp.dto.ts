import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResendOtpDto {
  @ApiProperty({
    description: 'Email address to resend OTP',
    example: 'an.roooof@gmail.com',
  })
  @Transform(({ value }) => value?.toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address / يرجى إدخال عنوان بريد إلكتروني صحيح' })
  email: string;
}