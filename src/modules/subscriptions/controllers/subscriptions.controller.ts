import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SubscriptionsService } from '../services/subscriptions.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpgradeSubscriptionDto } from '../dto/upgrade-subscription.dto';
import {
  SubscriptionPlanResponseDto,
  SubscriptionResponseDto,
  SubscriptionHistoryResponseDto,
} from '../dto/subscription-response.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all available subscription plans' })
  @ApiResponse({
    status: 200,
    description: 'Returns all active subscription plans',
    type: [SubscriptionPlanResponseDto],
  })
  async getAllPlans() {
    return this.subscriptionsService.getAllPlans();
  }

  @Get('my-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user subscription' })
  @ApiResponse({
    status: 200,
    description: 'Returns current user active subscription',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No active subscription found',
  })
  async getMySubscription(@Request() req) {
    return this.subscriptionsService.getMySubscription(req.user.userId);
  }

  @Post('create-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - User already has active subscription or payment failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription plan not found',
  })
  async createSubscription(
    @Request() req,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(
      req.user.userId,
      createSubscriptionDto,
    );
  }

  @Post('upgrade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upgrade subscription plan' })
  @ApiResponse({
    status: 200,
    description: 'Subscription upgraded successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Payment failed',
  })
  @ApiResponse({
    status: 404,
    description: 'No active subscription or plan not found',
  })
  async upgradeSubscription(
    @Request() req,
    @Body() upgradeSubscriptionDto: UpgradeSubscriptionDto,
  ) {
    return this.subscriptionsService.upgradeSubscription(
      req.user.userId,
      upgradeSubscriptionDto,
    );
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No active subscription found',
  })
  async cancelSubscription(@Request() req) {
    return this.subscriptionsService.cancelSubscription(req.user.userId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription history' })
  @ApiResponse({
    status: 200,
    description: 'Returns subscription history',
    type: [SubscriptionHistoryResponseDto],
  })
  async getSubscriptionHistory(@Request() req) {
    return this.subscriptionsService.getSubscriptionHistory(req.user.userId);
  }
}
