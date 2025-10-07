import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty({
    description: 'Plan name',
    example: 'Premium Plus',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Monthly price in USD',
    example: 24.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMonthly?: number;

  @ApiProperty({
    description: 'Yearly price in USD',
    example: 249.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceYearly?: number;

  @ApiProperty({
    description: 'List of features included in the plan',
    example: ['Unlimited likes', 'See who liked you', 'Profile boost'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiProperty({
    description: 'Maximum likes per day (null for unlimited)',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxLikesPerDay?: number;

  @ApiProperty({
    description: 'Can send messages',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  canSendMessages?: boolean;

  @ApiProperty({
    description: 'Can view sent likes',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  canViewLikes?: boolean;

  @ApiProperty({
    description: 'Can see who liked them',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  canSeeWhoLikedYou?: boolean;

  @ApiProperty({
    description: 'Has priority support',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  prioritySupport?: boolean;

  @ApiProperty({
    description: 'Profile badge text',
    example: 'Premium Plus Member',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileBadge?: string;

  @ApiProperty({
    description: 'Display order for sorting plans',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  displayOrder?: number;

  @ApiProperty({
    description: 'Is plan active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
