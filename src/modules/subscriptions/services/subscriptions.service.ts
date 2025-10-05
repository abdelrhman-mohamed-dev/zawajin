import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Subscription,
  SubscriptionStatus,
  BillingCycle,
  PaymentMethod,
} from '../entities/subscription.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import {
  SubscriptionHistory,
  SubscriptionAction,
} from '../entities/subscription-history.entity';
import { PaymentService } from './payment.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpgradeSubscriptionDto } from '../dto/upgrade-subscription.dto';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(SubscriptionHistory)
    private subscriptionHistoryRepository: Repository<SubscriptionHistory>,
    private paymentService: PaymentService,
  ) {}

  /**
   * Get all active subscription plans
   */
  async getAllPlans(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  /**
   * Get current user's active subscription
   */
  async getMySubscription(userId: string): Promise<Subscription | null> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
    });

    return subscription;
  }

  /**
   * Create new subscription with mock payment
   */
  async createSubscription(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const { planId, billingCycle } = createSubscriptionDto;

    // Check if user already has an active subscription
    const existingSubscription = await this.getMySubscription(userId);
    if (existingSubscription) {
      throw new BadRequestException({
        message: 'You already have an active subscription',
        messageAr: 'لديك بالفعل اشتراك نشط',
      });
    }

    // Get subscription plan
    const plan = await this.subscriptionPlanRepository.findOne({
      where: { id: planId, isActive: true },
    });

    if (!plan) {
      throw new NotFoundException({
        message: 'Subscription plan not found',
        messageAr: 'خطة الاشتراك غير موجودة',
      });
    }

    // Calculate amount and dates
    const amount =
      billingCycle === BillingCycle.MONTHLY
        ? plan.priceMonthly
        : plan.priceYearly;
    const startDate = new Date();
    const endDate = new Date();

    if (billingCycle === BillingCycle.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Process payment
    const paymentResult = await this.paymentService.processPayment(
      Number(amount),
    );

    if (!paymentResult.success) {
      throw new BadRequestException({
        message: paymentResult.message,
        messageAr: 'فشلت عملية الدفع',
      });
    }

    // Create subscription
    const subscription = this.subscriptionRepository.create({
      userId,
      planId,
      paymentMethod: PaymentMethod.MOCK_PAYMENT,
      status: SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      billingCycle,
      amount,
      currency: 'USD',
    });

    const savedSubscription = await this.subscriptionRepository.save(subscription);

    // Create history record
    await this.createHistoryRecord(
      savedSubscription.id,
      userId,
      planId,
      SubscriptionAction.CREATED,
      Number(amount),
      PaymentMethod.MOCK_PAYMENT,
    );

    this.logger.log(
      `Subscription created for user ${userId}, transaction: ${paymentResult.transactionId}`,
    );

    // Return with plan details
    return this.subscriptionRepository.findOne({
      where: { id: savedSubscription.id },
      relations: ['plan'],
    });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.getMySubscription(userId);

    if (!subscription) {
      throw new NotFoundException({
        message: 'No active subscription found',
        messageAr: 'لا يوجد اشتراك نشط',
      });
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.autoRenew = false;

    const updatedSubscription = await this.subscriptionRepository.save(subscription);

    // Create history record
    await this.createHistoryRecord(
      subscription.id,
      userId,
      subscription.planId,
      SubscriptionAction.CANCELLED,
      Number(subscription.amount),
      subscription.paymentMethod,
    );

    this.logger.log(`Subscription cancelled for user ${userId}`);

    return updatedSubscription;
  }

  /**
   * Upgrade subscription to a new plan
   */
  async upgradeSubscription(
    userId: string,
    upgradeSubscriptionDto: UpgradeSubscriptionDto,
  ): Promise<Subscription> {
    const { newPlanId, billingCycle } = upgradeSubscriptionDto;

    const currentSubscription = await this.getMySubscription(userId);

    if (!currentSubscription) {
      throw new NotFoundException({
        message: 'No active subscription found',
        messageAr: 'لا يوجد اشتراك نشط',
      });
    }

    // Get new plan
    const newPlan = await this.subscriptionPlanRepository.findOne({
      where: { id: newPlanId, isActive: true },
    });

    if (!newPlan) {
      throw new NotFoundException({
        message: 'Subscription plan not found',
        messageAr: 'خطة الاشتراك غير موجودة',
      });
    }

    // Calculate new amount
    const newAmount =
      billingCycle === BillingCycle.MONTHLY
        ? newPlan.priceMonthly
        : newPlan.priceYearly;

    // Process payment for upgrade
    const paymentResult = await this.paymentService.processPayment(
      Number(newAmount),
    );

    if (!paymentResult.success) {
      throw new BadRequestException({
        message: paymentResult.message,
        messageAr: 'فشلت عملية الدفع',
      });
    }

    // Determine if upgrade or downgrade
    const action =
      Number(newAmount) > Number(currentSubscription.amount)
        ? SubscriptionAction.UPGRADED
        : SubscriptionAction.DOWNGRADED;

    // Update subscription
    currentSubscription.planId = newPlanId;
    currentSubscription.billingCycle = billingCycle;
    currentSubscription.amount = newAmount;

    const updatedSubscription = await this.subscriptionRepository.save(
      currentSubscription,
    );

    // Create history record
    await this.createHistoryRecord(
      currentSubscription.id,
      userId,
      newPlanId,
      action,
      Number(newAmount),
      PaymentMethod.MOCK_PAYMENT,
    );

    this.logger.log(
      `Subscription ${action} for user ${userId}, transaction: ${paymentResult.transactionId}`,
    );

    // Return with plan details
    return this.subscriptionRepository.findOne({
      where: { id: updatedSubscription.id },
      relations: ['plan'],
    });
  }

  /**
   * Get subscription history for a user
   */
  async getSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]> {
    return this.subscriptionHistoryRepository.find({
      where: { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Check and expire subscriptions (called by cron job)
   */
  async checkExpiredSubscriptions(): Promise<void> {
    const now = new Date();

    const expiredSubscriptions = await this.subscriptionRepository.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
      },
    });

    for (const subscription of expiredSubscriptions) {
      if (subscription.endDate <= now) {
        subscription.status = SubscriptionStatus.EXPIRED;
        await this.subscriptionRepository.save(subscription);

        // Create history record
        await this.createHistoryRecord(
          subscription.id,
          subscription.userId,
          subscription.planId,
          SubscriptionAction.EXPIRED,
          Number(subscription.amount),
          subscription.paymentMethod,
        );

        this.logger.log(
          `Subscription expired for user ${subscription.userId}`,
        );
      }
    }
  }

  /**
   * Create subscription history record
   */
  private async createHistoryRecord(
    subscriptionId: string,
    userId: string,
    planId: string,
    action: SubscriptionAction,
    amount: number,
    paymentMethod: string,
  ): Promise<void> {
    const history = this.subscriptionHistoryRepository.create({
      subscriptionId,
      userId,
      planId,
      action,
      amount,
      paymentMethod,
    });

    await this.subscriptionHistoryRepository.save(history);
  }
}
