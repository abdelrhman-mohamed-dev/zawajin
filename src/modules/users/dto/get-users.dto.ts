import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
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
    example: 'Religious',
    description: 'Filter by religious practice',
    required: false,
  })
  @IsOptional()
  @IsString()
  religiousPractice?: string;
}
