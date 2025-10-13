import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEngagementDto {
  @ApiProperty({
    description: 'The ID of the recipient user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  recipientId: string;

  @ApiProperty({
    description: 'The ID of the conversation',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  conversationId: string;

  @ApiProperty({
    description: 'Optional message to send with the engagement request',
    example: 'Will you be engaged with me?',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
