import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FirebaseService } from '../../services/firebase.service';
import { SendPushNotificationDto } from './dto/send-notification.dto';
import { SendMulticastPushNotificationDto } from './dto/send-multicast-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send push notification to a single device' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  async sendNotification(@Body() dto: SendPushNotificationDto) {
    return await this.firebaseService.sendNotification(
      dto.token,
      dto.title,
      dto.body,
      dto.data,
    );
  }

  @Post('send-multicast')
  @ApiOperation({ summary: 'Send push notification to multiple devices' })
  @ApiResponse({ status: 200, description: 'Multicast notification sent successfully' })
  async sendMulticastNotification(@Body() dto: SendMulticastPushNotificationDto) {
    return await this.firebaseService.sendMulticastNotification(
      dto.tokens,
      dto.title,
      dto.body,
      dto.data,
    );
  }
}