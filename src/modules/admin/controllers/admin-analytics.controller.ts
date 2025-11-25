import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { AdminAnalyticsService } from '../services/admin-analytics.service';
import { VisitorsByCountryResponse, TopCountriesResponse } from '../dto/country-analytics.dto';

@ApiTags('Admin - Analytics')
@ApiBearerAuth()
@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('admin', 'super_admin')
export class AdminAnalyticsController {
  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  @Get('overview')
  @RequirePermissions('view_analytics')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Dashboard overview' })
  @ApiResponse({ status: 200, description: 'Overview fetched successfully' })
  async getOverview(@Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminAnalyticsService.getOverview(lang);
  }

  @Get('users')
  @RequirePermissions('view_analytics')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'User analytics' })
  @ApiResponse({ status: 200, description: 'User analytics fetched successfully' })
  async getUserAnalytics(@Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminAnalyticsService.getUserAnalytics(lang);
  }

  @Get('matches')
  @RequirePermissions('view_analytics')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Match analytics' })
  @ApiResponse({ status: 200, description: 'Match analytics fetched successfully' })
  async getMatchAnalytics(@Req() any) {
    const lang = any.headers['accept-language'] || 'en';
    return this.adminAnalyticsService.getMatchAnalytics(lang);
  }

  @Get('messages')
  @RequirePermissions('view_analytics')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Messaging analytics' })
  @ApiResponse({ status: 200, description: 'Messaging analytics fetched successfully' })
  async getMessageAnalytics(@Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminAnalyticsService.getMessageAnalytics(lang);
  }

  @Get('subscriptions')
  @RequirePermissions('view_analytics')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Subscription analytics' })
  @ApiResponse({ status: 200, description: 'Subscription analytics fetched successfully' })
  async getSubscriptionAnalytics(@Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminAnalyticsService.getSubscriptionAnalytics(lang);
  }

  @Get('visitors-by-country')
  @RequirePermissions('view_analytics')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get visitors by country for map visualization',
    description: 'Returns country data with coordinates, cities breakdown, and color-coded markers'
  })
  @ApiQuery({
    name: 'region',
    required: false,
    enum: ['all', 'middle_east', 'europe', 'asia', 'africa', 'americas'],
    example: 'middle_east',
    description: 'Filter by geographic region'
  })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['all', 'week', 'month', 'year'],
    example: 'month',
    description: 'Time period for user registration data'
  })
  @ApiResponse({
    status: 200,
    description: 'Country visitors data fetched successfully',
    type: VisitorsByCountryResponse
  })
  async getVisitorsByCountry(
    @Query('region') region?: string,
    @Query('period') period?: string,
    @Req() req?: any,
  ) {
    const lang = req?.headers['accept-language'] || 'en';
    return this.adminAnalyticsService.getVisitorsByCountry(region, period, lang);
  }

  @Get('top-countries')
  @RequirePermissions('view_analytics')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({
    summary: 'Get top countries ranked table',
    description: 'Returns ranked countries with user count, growth %, and revenue statistics'
  })
  @ApiResponse({
    status: 200,
    description: 'Top countries data fetched successfully',
    type: TopCountriesResponse
  })
  async getTopCountries(@Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminAnalyticsService.getTopCountries(lang);
  }
}
