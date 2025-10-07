import { Controller, Get, Query, UseGuards, Req, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { AdminSubscriptionService } from '../services/admin-subscription.service';

@ApiTags('Admin - Subscription Management')
@ApiBearerAuth()
@Controller('admin/subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('admin', 'super_admin')
export class AdminSubscriptionController {
  constructor(private readonly adminSubscriptionService: AdminSubscriptionService) {}

  @Get('plans')
  @RequirePermissions('manage_subscriptions')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiResponse({ status: 200, description: 'Subscription plans fetched successfully' })
  async getAllPlans(@Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminSubscriptionService.getAllSubscriptionPlans(lang);
  }

  @Get()
  @RequirePermissions('manage_subscriptions')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all active subscriptions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Subscriptions fetched successfully' })
  async getAllSubscriptions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminSubscriptionService.getAllSubscriptions(page, limit, lang);
  }
}
