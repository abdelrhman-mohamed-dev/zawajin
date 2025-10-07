import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({
    description: 'UUID of the user being reported',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  reportedUserId: string;

  @ApiProperty({
    description: 'Type of report',
    enum: [
      'inappropriate_content',
      'fake_profile',
      'harassment',
      'spam',
      'fraud',
      'other',
    ],
    example: 'harassment',
  })
  @IsEnum([
    'inappropriate_content',
    'fake_profile',
    'harassment',
    'spam',
    'fraud',
    'other',
  ])
  reportType: string;

  @ApiProperty({
    description: 'Detailed description of the issue',
    example: 'User is sending inappropriate messages',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Evidence (screenshots, message IDs, etc.)',
    example: { messageIds: ['msg1', 'msg2'], screenshots: ['url1', 'url2'] },
  })
  @IsOptional()
  @IsObject()
  evidence?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Related conversation ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID()
  conversationId?: string;
}
