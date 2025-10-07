import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SubscriptionPlan } from '../../modules/subscriptions/entities/subscription-plan.entity';
import { User } from '../../modules/auth/entities/user.entity';
import { MatchingPreferences } from '../../modules/matching/entities/matching-preferences.entity';
import { Like } from '../../modules/interactions/entities/like.entity';
import { Conversation } from '../../modules/chat/entities/conversation.entity';
import { Message } from '../../modules/chat/entities/message.entity';
import { Public } from '../../common/decorators/public.decorator';
import { seedUsers } from './users.seed';
import { seedMatchingPreferences } from './matching-preferences.seed';
import { seedLikes } from './likes.seed';
import { seedConversations } from './conversations.seed';

@Controller('seed')
@Public()
export class SeedController {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(MatchingPreferences)
    private matchingPreferencesRepository: Repository<MatchingPreferences>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private configService: ConfigService,
    private dataSource: DataSource,
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

  @Post('all')
  @HttpCode(HttpStatus.OK)
  async seedAll() {
    const results = {
      superAdmin: null,
      subscriptionPlans: null,
      users: null,
      matchingPreferences: null,
      likes: null,
      conversations: null,
    };

    try {
      // 1. Seed super admin
      const adminResult = await this.seedSuperAdmin();
      results.superAdmin = adminResult.message;

      // 2. Seed subscription plans
      const plansResult = await this.seedSubscriptionPlans();
      results.subscriptionPlans = plansResult.message;

      // 3. Seed users
      const users = await seedUsers(this.dataSource);
      results.users = `${users.length} users seeded`;

      // 4. Seed matching preferences
      await seedMatchingPreferences(this.dataSource, users);
      const prefsCount = await this.matchingPreferencesRepository.count();
      results.matchingPreferences = `${prefsCount} preferences seeded`;

      // 5. Seed likes
      await seedLikes(this.dataSource, users);
      const likesCount = await this.likeRepository.count();
      results.likes = `${likesCount} likes seeded`;

      // 6. Seed conversations
      await seedConversations(this.dataSource, users);
      const conversationsCount = await this.conversationRepository.count();
      const messagesCount = await this.messageRepository.count();
      results.conversations = `${conversationsCount} conversations with ${messagesCount} messages seeded`;

      return {
        success: true,
        message: 'All seeds completed successfully',
        results,
        note: 'Default password for test users: Test@123',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error during seeding',
        error: error.message,
        results,
      };
    }
  }
}
