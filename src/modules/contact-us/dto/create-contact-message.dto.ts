import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SatisfactionRating } from '../entities/contact-message.entity';

export class CreateContactMessageDto {
  @ApiPropertyOptional({
    description: 'User email (required if not authenticated)',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User name (required if not authenticated)',
    example: 'Ahmed Mohamed',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Contact message content',
    example: 'I have a question about my subscription...',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  @ApiPropertyOptional({
    description: 'Satisfaction rating (1-5 scale)',
    enum: SatisfactionRating,
    example: SatisfactionRating.SATISFIED,
  })
  @IsOptional()
  @IsEnum(SatisfactionRating)
  satisfactionRating?: SatisfactionRating;

  @ApiPropertyOptional({
    description: 'Service quality rating (1-10 scale)',
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  serviceRating?: number;
}
