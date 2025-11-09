import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import {
  ContactMessagePriority,
  ContactMessageStatus,
} from '../entities/contact-message.entity';

export class UpdateContactMessageDto {
  @ApiPropertyOptional({
    description: 'Message status',
    enum: ContactMessageStatus,
    example: ContactMessageStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(ContactMessageStatus)
  status?: ContactMessageStatus;

  @ApiPropertyOptional({
    description: 'Message priority',
    enum: ContactMessagePriority,
    example: ContactMessagePriority.HIGH,
  })
  @IsOptional()
  @IsEnum(ContactMessagePriority)
  priority?: ContactMessagePriority;

  @ApiPropertyOptional({
    description: 'Admin ID to assign this message to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  assignedToAdminId?: string;

  @ApiPropertyOptional({
    description: 'Admin response to the message',
    example: 'We have reviewed your request and will get back to you soon.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminResponse?: string;
}