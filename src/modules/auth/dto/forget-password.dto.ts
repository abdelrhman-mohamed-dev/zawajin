import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ForgetPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'an.roooof@gmail.com',
    required: true,
  })
  @Transform(({ value }) => value?.toLowerCase())
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
