import { IsString, IsArray, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMulticastPushNotificationDto {
  @ApiProperty({
    description: 'Array of FCM tokens',
    example: ['token1', 'token2', 'token3'],
  })
  @IsArray()
  @IsString({ each: true })
  tokens: string[];

  @ApiProperty({
    description: 'Notification title',
    example: 'New Announcement',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification body',
    example: 'Check out our latest updates',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Additional data payload',
    example: { type: 'announcement', id: '789' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
