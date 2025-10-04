import {
  IsString,
  IsInt,
  IsOptional,
  IsObject,
  IsEnum,
  Min,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty({ example: 'Dubai', description: 'City name' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'UAE', description: 'Country name' })
  @IsString()
  @MaxLength(100)
  country: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    example: 'A kind and practicing Muslim looking for a life partner.',
    description: 'User bio/description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiProperty({
    example: 30,
    description: 'User age',
    minimum: 18,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  age?: number;

  @ApiProperty({
    example: 'male',
    description: 'User gender',
    enum: ['male', 'female'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female'], {
    message: 'Gender must be either male or female',
  })
  gender?: string;

  @ApiProperty({
    example: { city: 'Dubai', country: 'UAE' },
    description: 'User location',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({
    example: 'Religious',
    description: 'Level of religious practice',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  religiousPractice?: string;

  @ApiProperty({
    example: 'Sunni',
    description: 'Religious sect',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sect?: string;

  @ApiProperty({
    example: 'Prays 5 times a day',
    description: 'Prayer level',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  prayerLevel?: string;

  @ApiProperty({
    example: 'single',
    description: 'Marital status',
    enum: ['single', 'divorced', 'widowed'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['single', 'divorced', 'widowed'], {
    message: 'Marital status must be one of: single, divorced, widowed',
  })
  maritalStatus?: string;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'Profession/occupation',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  profession?: string;
}
