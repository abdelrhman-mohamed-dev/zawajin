import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Subscription, SubscriptionStatus } from '../../subscriptions/entities/subscription.entity';
import { SubscriptionPlan } from '../../subscriptions/entities/subscription-plan.entity';
import { Message } from '../../chat/entities/message.entity';
import { Like } from '../../interactions/entities/like.entity';
import { getCountryInfo, getCountryColor, formatUserCount } from '../utils/country-mapping.util';
import { CountryData, CityData, CountryStats } from '../dto/country-analytics.dto';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
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

  /**
   * Get visitors by country with map data
   */
  async getVisitorsByCountry(
    region?: string,
    period?: string,
    lang: string = 'en',
  ) {
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date(0); // Default: all time

    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === 'year') {
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    // Query users grouped by country and city
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select("user.location->>'country'", 'country')
      .addSelect("user.location->>'city'", 'city')
      .addSelect('COUNT(*)', 'count')
      .where('user.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere("user.location->>'country' IS NOT NULL");

    if (period && period !== 'all') {
      queryBuilder.andWhere('user.createdAt >= :startDate', { startDate });
    }

    queryBuilder
      .groupBy("user.location->>'country'")
      .addGroupBy("user.location->>'city'")
      .orderBy('count', 'DESC');

    const results = await queryBuilder.getRawMany();

    // Group by country
    const countryMap = new Map<string, { count: number; cities: Map<string, number> }>();

    results.forEach(row => {
      const country = row.country;
      const city = row.city || 'Unknown';
      const count = parseInt(row.count);

      if (!countryMap.has(country)) {
        countryMap.set(country, { count: 0, cities: new Map() });
      }

      const countryData = countryMap.get(country);
      countryData.count += count;
      countryData.cities.set(city, count);
    });

    // Filter by region if specified
    let filteredCountries = Array.from(countryMap.entries());
    if (region && region !== 'all') {
      filteredCountries = filteredCountries.filter(([countryName]) => {
        const info = getCountryInfo(countryName);
        return info.region === region;
      });
    }

    // Get max count for color calculation
    const maxCount = Math.max(...filteredCountries.map(([_, data]) => data.count), 1);

    // Transform to response format
    const countries: CountryData[] = filteredCountries.map(([countryName, data]) => {
      const countryInfo = getCountryInfo(countryName);

      // Sort cities by user count and take top cities
      const citiesArray = Array.from(data.cities.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 cities

      const cities: CityData[] = citiesArray.map(([cityName, cityCount]) => ({
        name: cityName,
        users: formatUserCount(cityCount),
      }));

      return {
        name: countryName,
        users: formatUserCount(data.count),
        coordinates: countryInfo.coordinates,
        color: getCountryColor(data.count, maxCount),
        flag: countryInfo.flag,
        cities,
      };
    });

    // Sort by user count
    countries.sort((a, b) => {
      const aCount = parseInt(a.users.replace(/[^0-9]/g, ''));
      const bCount = parseInt(b.users.replace(/[^0-9]/g, ''));
      return bCount - aCount;
    });

    return {
      success: true,
      data: {
        countries,
      },
    };
  }

  /**
   * Get top countries table with stats
   */
  async getTopCountries(lang: string = 'en') {
    const now = new Date();
    const currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const previousPeriodEnd = currentPeriodStart;

    // Get current period users by country
    const currentUsers = await this.userRepository
      .createQueryBuilder('user')
      .select("user.location->>'country'", 'country')
      .addSelect('COUNT(*)', 'count')
      .where('user.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere("user.location->>'country' IS NOT NULL")
      .groupBy("user.location->>'country'")
      .getRawMany();

    // Get previous period users by country for growth calculation
    const previousUsers = await this.userRepository
      .createQueryBuilder('user')
      .select("user.location->>'country'", 'country')
      .addSelect('COUNT(*)', 'count')
      .where('user.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('user.createdAt >= :start', { start: previousPeriodStart })
      .andWhere('user.createdAt < :end', { end: previousPeriodEnd })
      .andWhere("user.location->>'country' IS NOT NULL")
      .groupBy("user.location->>'country'")
      .getRawMany();

    const previousCountMap = new Map<string, number>(
      previousUsers.map(row => [row.country, parseInt(row.count)])
    );

    // Get revenue by country
    const revenueByCountry = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .leftJoin('sub.user', 'user')
      .leftJoin('sub.plan', 'plan')
      .select("user.location->>'country'", 'country')
      .addSelect('SUM(plan.price)', 'revenue')
      .where('sub.status = :status', { status: SubscriptionStatus.ACTIVE })
      .andWhere("user.location->>'country' IS NOT NULL")
      .groupBy("user.location->>'country'")
      .getRawMany();

    const revenueMap = new Map<string, number>(
      revenueByCountry.map(row => [row.country, parseFloat(row.revenue) || 0])
    );

    const totalUsers = currentUsers.reduce((sum, row) => sum + parseInt(row.count), 0);
    const totalRevenue = Array.from(revenueMap.values()).reduce((sum, val) => sum + val, 0);

    // Build country stats
    const countries: CountryStats[] = currentUsers.map((row, index) => {
      const countryName = row.country;
      const currentCount = parseInt(row.count);
      const previousCount = previousCountMap.get(countryName) || 0;

      // Calculate growth percentage
      let growth = 0;
      if (previousCount > 0) {
        growth = ((currentCount - previousCount) / previousCount) * 100;
      } else if (currentCount > 0) {
        growth = 100; // New country
      }

      const countryInfo = getCountryInfo(countryName);

      return {
        rank: index + 1,
        country: countryName,
        flag: countryInfo.flag,
        users: currentCount,
        percentage: totalUsers > 0 ? (currentCount / totalUsers) * 100 : 0,
        growth: Math.round(growth * 10) / 10, // Round to 1 decimal
        revenue: revenueMap.get(countryName) || 0,
      };
    });

    // Sort by user count descending
    countries.sort((a, b) => b.users - a.users);

    // Update ranks after sorting
    countries.forEach((country, index) => {
      country.rank = index + 1;
    });

    return {
      success: true,
      data: {
        countries,
        totalUsers,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
    };
  }
}
