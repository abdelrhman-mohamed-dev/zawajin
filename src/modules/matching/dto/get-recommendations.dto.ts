import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsEnum, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class GetRecommendationsDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of results per page',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiProperty({
    description: 'Minimum compatibility score (0-100)',
    example: 50,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  minCompatibilityScore?: number;

  // Basic filters
  @ApiProperty({
    description: 'Filter by gender',
    example: 'female',
    enum: ['male', 'female'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiProperty({
    description: 'Filter by marital status',
    example: 'single',
    enum: ['single', 'divorced', 'widowed'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['single', 'divorced', 'widowed'])
  maritalStatus?: string;

  @ApiProperty({
    description: 'Minimum age',
    example: 25,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  @Max(100)
  minAge?: number;

  @ApiProperty({
    description: 'Maximum age',
    example: 35,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  @Max(100)
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

  // New profile filters
  @ApiProperty({
    example: 'Saudi',
    description: 'Filter by nationality',
    required: false,
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({
    example: 'Riyadh',
    description: 'Filter by place of residence',
    required: false,
  })
  @IsOptional()
  @IsString()
  placeOfResidence?: string;

  @ApiProperty({
    example: 'tribal',
    description: 'Filter by tribe',
    enum: ['tribal', 'non_tribal', 'other'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['tribal', 'non_tribal', 'other'])
  tribe?: string;

  @ApiProperty({
    example: 0,
    description: 'Filter by number of children',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  numberOfChildren?: number;

  @ApiProperty({
    example: 'university',
    description: 'Filter by education level',
    enum: ['secondary', 'diploma', 'university', 'higher_education'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['secondary', 'diploma', 'university', 'higher_education'])
  educationLevel?: string;

  @ApiProperty({
    example: 'good',
    description: 'Filter by financial status',
    enum: ['poor', 'good', 'excellent'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['poor', 'good', 'excellent'])
  financialStatus?: string;

  @ApiProperty({
    example: 'healthy',
    description: 'Filter by health status',
    enum: ['healthy', 'chronically_ill', 'disabled'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['healthy', 'chronically_ill', 'disabled'])
  healthStatus?: string;

  @ApiProperty({
    example: 'committed',
    description: 'Filter by religiosity level',
    enum: ['normal', 'conservative', 'committed'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['normal', 'conservative', 'committed'])
  religiosityLevel?: string;

  @ApiProperty({
    example: 'white',
    description: 'Filter by skin color',
    enum: ['white', 'brown', 'black'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['white', 'brown', 'black'])
  skinColor?: string;

  @ApiProperty({
    example: 'handsome',
    description: 'Filter by beauty/appearance',
    enum: ['acceptable', 'average', 'handsome', 'beautiful', 'very_beautiful'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['acceptable', 'average', 'handsome', 'beautiful', 'very_beautiful'])
  beauty?: string;

  @ApiProperty({
    example: 'no',
    description: 'Filter by polygamy status',
    enum: ['yes', 'no', 'thinking'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['yes', 'no', 'thinking'])
  polygamyStatus?: string;
}
