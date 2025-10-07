import { Controller, Get, Post, Put, Delete, Query, Body, Param, UseGuards, Req, ParseIntPipe, DefaultValuePipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { AdminSubscriptionService } from '../services/admin-subscription.service';
import { CreatePlanDto } from '../../subscriptions/dto/create-plan.dto';
import { UpdatePlanDto } from '../../subscriptions/dto/update-plan.dto';

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

  @Post('plans')
  @RequirePermissions('manage_subscriptions')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create new subscription plan' })
  @ApiResponse({ status: 201, description: 'Subscription plan created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async createPlan(@Body() createPlanDto: CreatePlanDto, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.sub;
    return this.adminSubscriptionService.createPlan(createPlanDto, adminId, lang);
  }

  @Put('plans/:id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('manage_subscriptions')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Update subscription plan' })
  @ApiResponse({ status: 200, description: 'Subscription plan updated successfully' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async updatePlan(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.sub;
    return this.adminSubscriptionService.updatePlan(id, updatePlanDto, adminId, lang);
  }

  @Delete('plans/:id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('manage_subscriptions')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Deactivate subscription plan' })
  @ApiResponse({ status: 200, description: 'Subscription plan deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 400, description: 'Cannot deactivate plan with active subscriptions' })
  async deactivatePlan(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.sub;
    return this.adminSubscriptionService.deactivatePlan(id, adminId, lang);
  }
}
