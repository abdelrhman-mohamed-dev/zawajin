import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  ArrayNotEmpty,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Plan name',
    example: 'Premium Plus',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Monthly price in USD',
    example: 24.99,
  })
  @IsNumber()
  @Min(0)
  priceMonthly: number;

  @ApiProperty({
    description: 'Yearly price in USD',
    example: 249.99,
  })
  @IsNumber()
  @Min(0)
  priceYearly: number;

  @ApiProperty({
    description: 'List of features included in the plan',
    example: ['Unlimited likes', 'See who liked you', 'Profile boost'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features: string[];

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
  })
  @IsBoolean()
  canSendMessages: boolean;

  @ApiProperty({
    description: 'Can view sent likes',
    example: true,
  })
  @IsBoolean()
  canViewLikes: boolean;

  @ApiProperty({
    description: 'Can see who liked them',
    example: true,
  })
  @IsBoolean()
  canSeeWhoLikedYou: boolean;

  @ApiProperty({
    description: 'Has priority support',
    example: true,
  })
  @IsBoolean()
  prioritySupport: boolean;

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
  })
  @IsInt()
  @Min(1)
  displayOrder: number;
}
