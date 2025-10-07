import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Subscription, SubscriptionStatus } from '../../subscriptions/entities/subscription.entity';
import { Message } from '../../chat/entities/message.entity';
import { Like } from '../../interactions/entities/like.entity';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly i18n: I18nService,
  ) {}

  async getOverview(lang: string = 'en') {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeUsers, newUsersLast30Days, activeSubscriptions] = await Promise.all([
      this.userRepository.count({ where: { isDeleted: false } }),
      this.userRepository.count({ where: { isDeleted: false, isActive: true } }),
      this.userRepository.count({ where: { createdAt: MoreThanOrEqual(last30Days) } }),
      this.subscriptionRepository.count({ where: { status: SubscriptionStatus.ACTIVE } }),
    ]);

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
      data: {
        totalUsers,
        activeUsers,
        newUsersLast30Days,
        activeSubscriptions,
      },
    };
  }

  async getUserAnalytics(lang: string = 'en') {
    // Placeholder for user analytics
    return {
      success: true,
      message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
      data: {
        dailyGrowth: [],
        weeklyGrowth: [],
        monthlyGrowth: [],
        retention: {},
      },
    };
  }

  async getMatchAnalytics(lang: string = 'en') {
    const totalMatches = await this.likeRepository
      .createQueryBuilder('like')
      .innerJoin('likes', 'l2', 'like.likedUserId = l2.userId AND like.userId = l2.likedUserId')
      .getCount();

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
      data: {
        totalMatches,
        matchRate: 0, // TODO: Calculate match rate
      },
    };
  }

  async getMessageAnalytics(lang: string = 'en') {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const messagesLast30Days = await this.messageRepository.count({
      where: { createdAt: MoreThanOrEqual(last30Days) },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
      data: {
        messagesLast30Days,
        activeConversations: 0, // TODO: Implement
      },
    };
  }

  async getSubscriptionAnalytics(lang: string = 'en') {
    // Placeholder for subscription analytics
    return {
      success: true,
      message: await this.i18n.translate('admin.messages.analyticsFetched', { lang }),
      data: {
        revenue: 0,
        conversions: 0,
        churn: 0,
      },
    };
  }
}
