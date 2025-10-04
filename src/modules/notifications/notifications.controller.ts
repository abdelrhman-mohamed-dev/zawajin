import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseService } from '../../services/firebase.service';

export class SendNotificationDto {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class SendMulticastNotificationDto {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto) {
    return await this.firebaseService.sendNotification(
      dto.token,
      dto.title,
      dto.body,
      dto.data,
    );
  }

  @Post('send-multicast')
  async sendMulticastNotification(@Body() dto: SendMulticastNotificationDto) {
    return await this.firebaseService.sendMulticastNotification(
      dto.tokens,
      dto.title,
      dto.body,
      dto.data,
    );
  }
}