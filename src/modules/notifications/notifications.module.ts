import { Module, forwardRef } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { FirebaseService } from '../../services/firebase.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [forwardRef(() => ChatModule)],
  controllers: [NotificationsController],
  providers: [FirebaseService, NotificationsService],
  exports: [FirebaseService, NotificationsService],
})
export class NotificationsModule {}