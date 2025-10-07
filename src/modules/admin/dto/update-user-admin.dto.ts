import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserAdminDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'User biography',
    example: 'Looking for a life partner...',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Age of the user',
    example: 28,
  })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: ['male', 'female'],
    example: 'male',
  })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({
    description: 'Location object with city and country',
    example: { city: 'Dubai', country: 'UAE' },
  })
  @IsOptional()
  @IsObject()
  location?: { city: string; country: string };

  @ApiPropertyOptional({
    description: 'Religious practice level',
    example: 'Religious',
  })
  @IsOptional()
  @IsString()
  religiousPractice?: string;

  @ApiPropertyOptional({
    description: 'Sect',
    example: 'Sunni',
  })
  @IsOptional()
  @IsString()
  sect?: string;

  @ApiPropertyOptional({
    description: 'Prayer level',
    example: 'Prays 5 times a day',
  })
  @IsOptional()
  @IsString()
  prayerLevel?: string;

  @ApiPropertyOptional({
    description: 'Marital status',
    enum: ['single', 'divorced', 'widowed'],
    example: 'single',
  })
  @IsOptional()
  @IsEnum(['single', 'divorced', 'widowed'])
  maritalStatus?: string;

  @ApiPropertyOptional({
    description: 'Profession',
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  profession?: string;

  @ApiPropertyOptional({
    description: 'Is email verified',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Is phone verified',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Is user active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
