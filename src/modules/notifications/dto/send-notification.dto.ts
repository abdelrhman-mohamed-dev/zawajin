import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPushNotificationDto {
  @ApiProperty({
    description: 'FCM token of the target device',
    example: 'fcm_token_here',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Notification title',
    example: 'New Message',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification body',
    example: 'You have a new message from John',
  })
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Additional data payload',
    example: { userId: '123', messageId: '456' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
