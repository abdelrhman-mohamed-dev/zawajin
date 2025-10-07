import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  IsString,
  IsArray,
  IsEnum,
  Min,
  Max,
  ArrayNotEmpty,
} from 'class-validator';

export class UpdatePreferencesDto {
  @ApiProperty({
    description: 'Minimum age preference',
    example: 25,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  minAge?: number;

  @ApiProperty({
    description: 'Maximum age preference',
    example: 35,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  maxAge?: number;

  @ApiProperty({
    description: 'Preferred city',
    example: 'Dubai',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferredCity?: string;

  @ApiProperty({
    description: 'Preferred country',
    example: 'UAE',
    required: false,
  })
  @IsOptional()
  @IsString()
  preferredCountry?: string;

  @ApiProperty({
    description: 'Maximum distance in kilometers',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxDistanceKm?: number;

  @ApiProperty({
    description: 'Preferred religious practice levels',
    example: ['Religious', 'Moderate'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredReligiousPractices?: string[];

  @ApiProperty({
    description: 'Preferred sects',
    example: ['Sunni'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredSects?: string[];

  @ApiProperty({
    description: 'Preferred prayer levels',
    example: ['Prays 5 times a day', 'Sometimes'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredPrayerLevels?: string[];

  @ApiProperty({
    description: 'Preferred marital statuses',
    example: ['single', 'divorced'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredMaritalStatuses?: string[];

  @ApiProperty({
    description: 'Preferred professions',
    example: ['Engineer', 'Doctor'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredProfessions?: string[];

  @ApiProperty({
    description: 'Gender looking for',
    example: 'female',
    enum: ['male', 'female'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female'])
  lookingForGender?: string;

  @ApiProperty({
    description: 'Age importance (0-10)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  ageImportance?: number;

  @ApiProperty({
    description: 'Location importance (0-10)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  locationImportance?: number;

  @ApiProperty({
    description: 'Religious importance (0-10)',
    example: 8,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  religiousImportance?: number;

  @ApiProperty({
    description: 'Marital status importance (0-10)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  maritalStatusImportance?: number;

  @ApiProperty({
    description: 'Profession importance (0-10)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  professionImportance?: number;
}
