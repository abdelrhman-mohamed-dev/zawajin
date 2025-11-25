import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { UserReport } from './entities/user-report.entity';
import { ActivityLog } from './entities/activity-log.entity';
import { AdminAction } from './entities/admin-action.entity';
import { AdminNotification } from './entities/admin-notification.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { SubscriptionPlan } from '../subscriptions/entities/subscription-plan.entity';
import { SubscriptionHistory } from '../subscriptions/entities/subscription-history.entity';
import { Message } from '../chat/entities/message.entity';
import { Conversation } from '../chat/entities/conversation.entity';
import { Like } from '../interactions/entities/like.entity';
import { UserReportRepository } from './repositories/user-report.repository';
import { ActivityLogRepository } from './repositories/activity-log.repository';
import { AdminActionRepository } from './repositories/admin-action.repository';
import { AdminNotificationRepository } from './repositories/admin-notification.repository';
import { UserRepository } from '../auth/repositories/user.repository';
import { AdminUserService } from './services/admin-user.service';
import { AdminRoleService } from './services/admin-role.service';
import { AdminReportService } from './services/admin-report.service';
import { AdminSubscriptionService } from './services/admin-subscription.service';
import { AdminAnalyticsService } from './services/admin-analytics.service';
import { AdminChatService } from './services/admin-chat.service';
import { AdminSettingsService } from './services/admin-settings.service';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminRoleController } from './controllers/admin-role.controller';
import { AdminReportController } from './controllers/admin-report.controller';
import { AdminSubscriptionController } from './controllers/admin-subscription.controller';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller';
import { AdminChatController } from './controllers/admin-chat.controller';
import { AdminSettingsController } from './controllers/admin-settings.controller';
import { PublicSettingsController } from './controllers/public-settings.controller';
import { ConversationRepository } from '../chat/repositories/conversation.repository';
import { MessageRepository } from '../chat/repositories/message.repository';
import { MailModule } from '../mail/mail.module';
import { FirebaseService } from '../../services/firebase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserReport,
      ActivityLog,
      AdminAction,
      AdminNotification,
      SystemSettings,
      Subscription,
      SubscriptionPlan,
      SubscriptionHistory,
      Message,
      Conversation,
      Like,
    ]),
    MailModule,
  ],
  controllers: [
    AdminUserController,
    AdminRoleController,
    AdminReportController,
    AdminSubscriptionController,
    AdminAnalyticsController,
    AdminChatController,
    AdminSettingsController,
    PublicSettingsController,
  ],
  providers: [
    UserRepository,
    UserReportRepository,
    ActivityLogRepository,
    AdminActionRepository,
    AdminNotificationRepository,
    ConversationRepository,
    MessageRepository,
    AdminUserService,
    AdminRoleService,
    AdminReportService,
    AdminSubscriptionService,
    AdminAnalyticsService,
    AdminChatService,
    AdminSettingsService,
    FirebaseService,
  ],
  exports: [AdminUserService, AdminReportService, AdminAnalyticsService],
})
export class AdminModule {}
