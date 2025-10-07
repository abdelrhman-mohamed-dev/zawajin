import {
  IsString,
  IsEmail,
  IsEnum,
  IsArray,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Full name',
    example: 'Admin User',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'admin@zawaj.in',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Gender',
    enum: ['male', 'female'],
    example: 'male',
  })
  @IsEnum(['male', 'female'])
  gender: string;

  @ApiProperty({
    description: 'Password (min 8 characters, must include uppercase, lowercase, and number)',
    example: 'Admin@123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Array of permission strings',
    example: ['manage_users', 'manage_reports'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
