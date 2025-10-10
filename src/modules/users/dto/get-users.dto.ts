import { IsOptional, IsInt, Min, IsEnum, IsString, IsBoolean, IsNumber, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetUsersDto {
  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  // Basic filters
  @ApiProperty({
    example: 'male',
    description: 'Filter by gender',
    enum: ['male', 'female'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiProperty({
    example: 'single',
    description: 'Filter by marital status',
    enum: ['single', 'divorced', 'widowed'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['single', 'divorced', 'widowed'])
  maritalStatus?: string;

  @ApiProperty({
    example: 25,
    description: 'Minimum age filter',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  minAge?: number;

  @ApiProperty({
    example: 35,
    description: 'Maximum age filter',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  maxAge?: number;

  // Location filters
  @ApiProperty({
    example: 'Dubai',
    description: 'Filter by city',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'UAE',
    description: 'Filter by country',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: 'Egyptian',
    description: 'Filter by origin',
    required: false,
  })
  @IsOptional()
  @IsString()
  origin?: string;

  // Religious filters
  @ApiProperty({
    example: 'Religious',
    description: 'Filter by religious practice',
    required: false,
  })
  @IsOptional()
  @IsString()
  religiousPractice?: string;

  @ApiProperty({
    example: 'Sunni',
    description: 'Filter by sect',
    required: false,
  })
  @IsOptional()
  @IsString()
  sect?: string;

  @ApiProperty({
    example: 'Prays 5 times a day',
    description: 'Filter by prayer level',
    required: false,
  })
  @IsOptional()
  @IsString()
  prayerLevel?: string;

  // Professional filters
  @ApiProperty({
    example: 'Engineer',
    description: 'Filter by profession',
    required: false,
  })
  @IsOptional()
  @IsString()
  profession?: string;

  // Physical attributes filters
  @ApiProperty({
    example: 165,
    description: 'Minimum height (cm)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  minHeight?: number;

  @ApiProperty({
    example: 180,
    description: 'Maximum height (cm)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(100)
  maxHeight?: number;

  @ApiProperty({
    example: 50,
    description: 'Minimum weight (kg)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(30)
  minWeight?: number;

  @ApiProperty({
    example: 80,
    description: 'Maximum weight (kg)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(30)
  maxWeight?: number;

  @ApiProperty({
    example: 'fair',
    description: 'Filter by body color',
    required: false,
  })
  @IsOptional()
  @IsString()
  bodyColor?: string;

  @ApiProperty({
    example: 'black',
    description: 'Filter by hair color',
    required: false,
  })
  @IsOptional()
  @IsString()
  hairColor?: string;

  @ApiProperty({
    example: 'straight',
    description: 'Filter by hair type',
    required: false,
  })
  @IsOptional()
  @IsString()
  hairType?: string;

  @ApiProperty({
    example: 'brown',
    description: 'Filter by eye color',
    required: false,
  })
  @IsOptional()
  @IsString()
  eyeColor?: string;

  // Marriage preferences filters
  @ApiProperty({
    example: 'religious',
    description: 'Filter by marriage type',
    required: false,
  })
  @IsOptional()
  @IsString()
  marriageType?: string;

  @ApiProperty({
    example: true,
    description: 'Filter by house availability',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  houseAvailable?: boolean;

  @ApiProperty({
    example: false,
    description: 'Filter by polygamy acceptance',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  acceptPolygamy?: boolean;

  @ApiProperty({
    example: 'Full-time office job',
    description: 'Filter by nature of work',
    required: false,
  })
  @IsOptional()
  @IsString()
  natureOfWork?: string;
}
