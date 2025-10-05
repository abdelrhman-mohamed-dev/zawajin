import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../../modules/subscriptions/entities/subscription-plan.entity';

@Controller('seed')
export class SeedController {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
  ) {}

  @Post('subscription-plans')
  @HttpCode(HttpStatus.OK)
  async seedSubscriptionPlans() {
    // Check if plans already exist
    const existingPlans = await this.subscriptionPlanRepository.count();
    if (existingPlans > 0) {
      return {
        message: 'Subscription plans already exist',
        count: existingPlans,
      };
    }

    const plans = [
      {
        name: 'Free',
        priceMonthly: 0,
        priceYearly: 0,
        features: [
          'Create profile',
          '5 likes per day',
          'View profiles',
          'Basic filters',
        ],
        maxLikesPerDay: 5,
        canSendMessages: false,
        canViewLikes: false,
        canSeeWhoLikedYou: false,
        prioritySupport: false,
        profileBadge: null,
        isActive: true,
        displayOrder: 1,
      },
      {
        name: 'Basic',
        priceMonthly: 9.99,
        priceYearly: 99.99,
        features: [
          'Everything in Free',
          '20 likes per day',
          'Send messages',
          'View your sent likes',
          'Advanced filters',
          'Read receipts',
        ],
        maxLikesPerDay: 20,
        canSendMessages: true,
        canViewLikes: true,
        canSeeWhoLikedYou: false,
        prioritySupport: false,
        profileBadge: 'Basic Member',
        isActive: true,
        displayOrder: 2,
      },
      {
        name: 'Premium',
        priceMonthly: 19.99,
        priceYearly: 199.99,
        features: [
          'Everything in Basic',
          'Unlimited likes',
          'See who liked you',
          'Profile boost',
          'Advanced search',
          'Priority customer support',
          'Premium badge',
        ],
        maxLikesPerDay: null, // unlimited
        canSendMessages: true,
        canViewLikes: true,
        canSeeWhoLikedYou: true,
        prioritySupport: true,
        profileBadge: 'Premium Member',
        isActive: true,
        displayOrder: 3,
      },
      {
        name: 'Gold',
        priceMonthly: 29.99,
        priceYearly: 299.99,
        features: [
          'Everything in Premium',
          'Unlimited likes',
          'See who liked you',
          'Profile boost (2x)',
          'Advanced search with AI matching',
          '24/7 Priority customer support',
          'Gold badge',
          'Profile verification priority',
          'Featured profile',
        ],
        maxLikesPerDay: null, // unlimited
        canSendMessages: true,
        canViewLikes: true,
        canSeeWhoLikedYou: true,
        prioritySupport: true,
        profileBadge: 'Gold Member',
        isActive: true,
        displayOrder: 4,
      },
    ];

    const savedPlans = await this.subscriptionPlanRepository.save(plans);

    return {
      message: 'Subscription plans seeded successfully',
      count: savedPlans.length,
      plans: savedPlans.map((p) => ({ id: p.id, name: p.name })),
    };
  }
}
