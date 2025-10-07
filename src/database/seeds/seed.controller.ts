import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SubscriptionPlan } from '../../modules/subscriptions/entities/subscription-plan.entity';
import { User } from '../../modules/auth/entities/user.entity';
import { Public } from '../../common/decorators/public.decorator';

@Controller('seed')
@Public()
export class SeedController {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
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

  @Post('super-admin')
  @HttpCode(HttpStatus.OK)
  async seedSuperAdmin() {
    // Get super admin details from environment variables
    const email = this.configService.get<string>('SUPER_ADMIN_EMAIL', 'superadmin@zawaj.in');
    const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD', 'SuperAdmin@123');
    const fullName = this.configService.get<string>('SUPER_ADMIN_FULL_NAME', 'Super Administrator');
    const phone = this.configService.get<string>('SUPER_ADMIN_PHONE', '+1234567890');
    const gender = this.configService.get<string>('SUPER_ADMIN_GENDER', 'male');

    // Check if super admin already exists
    const existingSuperAdmin = await this.userRepository.findOne({
      where: { email },
    });

    if (existingSuperAdmin) {
      return {
        message: 'Super admin already exists',
        email: email,
      };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create super admin user
    const superAdmin = this.userRepository.create({
      fullName,
      email,
      phone,
      gender,
      passwordHash,
      role: 'super_admin',
      permissions: null,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      isVerified: true,
      verifiedAt: new Date(),
    });

    await this.userRepository.save(superAdmin);

    return {
      message: 'Super admin created successfully',
      email: email,
      warning: 'Please change the password after first login',
    };
  }
}
