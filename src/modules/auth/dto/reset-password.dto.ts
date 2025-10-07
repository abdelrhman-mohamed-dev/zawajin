import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../../../common/decorators/match.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'an.roooof@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'New password (minimum 8 characters, must contain at least one uppercase letter, one lowercase letter, and one number)',
    example: 'NewPassword123',
    minLength: 8,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirm new password (must match new password)',
    example: 'NewPassword123',
    minLength: 8,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}
