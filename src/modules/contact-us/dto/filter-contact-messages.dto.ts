import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import {
  ContactMessagePriority,
  ContactMessageStatus,
} from '../entities/contact-message.entity';

export class FilterContactMessagesDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ContactMessageStatus,
    example: ContactMessageStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ContactMessageStatus)
  status?: ContactMessageStatus;

  @ApiPropertyOptional({
    description: 'Filter by priority',
    enum: ContactMessagePriority,
    example: ContactMessagePriority.HIGH,
  })
  @IsOptional()
  @IsEnum(ContactMessagePriority)
  priority?: ContactMessagePriority;

  @ApiPropertyOptional({
    description: 'Filter by assigned admin ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  assignedToAdminId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
