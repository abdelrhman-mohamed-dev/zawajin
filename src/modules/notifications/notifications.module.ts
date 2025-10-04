import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { FirebaseService } from '../../services/firebase.service';

@Module({
  controllers: [NotificationsController],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class NotificationsModule {}