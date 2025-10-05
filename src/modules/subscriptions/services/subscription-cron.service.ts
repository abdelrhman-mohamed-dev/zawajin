import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionsService } from './subscriptions.service';

@Injectable()
export class SubscriptionCronService {
  private readonly logger = new Logger(SubscriptionCronService.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * Check for expired subscriptions every day at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    this.logger.log('Running subscription expiration check...');

    try {
      await this.subscriptionsService.checkExpiredSubscriptions();
      this.logger.log('Subscription expiration check completed');
    } catch (error) {
      this.logger.error('Error checking expired subscriptions:', error);
    }
  }

  /**
   * Optional: Check every 6 hours for more frequent checks
   * Uncomment to enable more frequent checking
   */
  // @Cron(CronExpression.EVERY_6_HOURS)
  // async checkExpiredSubscriptionsFrequent() {
  //   this.logger.log('Running frequent subscription expiration check...');
  //   await this.subscriptionsService.checkExpiredSubscriptions();
  // }
}
