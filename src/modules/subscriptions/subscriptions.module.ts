import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './services/subscriptions.service';
import { PaymentService } from './services/payment.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { SubscriptionHistory } from './entities/subscription-history.entity';
import { SubscriptionCronService } from './services/subscription-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, SubscriptionPlan, SubscriptionHistory]),
  ],
  providers: [SubscriptionsService, PaymentService, SubscriptionCronService],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
