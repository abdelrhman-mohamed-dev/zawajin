import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendNotificationDto {
  @ApiProperty({
    description: 'Notification subject',
    example: 'Important Update',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your profile has been verified successfully.',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: ['email', 'push', 'internal'],
    example: 'email',
  })
  @IsEnum(['email', 'push', 'internal'])
  notificationType: string;
}
