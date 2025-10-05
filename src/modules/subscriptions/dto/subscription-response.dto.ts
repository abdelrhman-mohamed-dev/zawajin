import { ApiProperty } from '@nestjs/swagger';
import {
  SubscriptionStatus,
  BillingCycle,
  PaymentMethod,
} from '../entities/subscription.entity';

export class SubscriptionPlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  priceMonthly: number;

  @ApiProperty()
  priceYearly: number;

  @ApiProperty({ type: [String] })
  features: string[];

  @ApiProperty()
  maxLikesPerDay: number | null;

  @ApiProperty()
  canSendMessages: boolean;

  @ApiProperty()
  canViewLikes: boolean;

  @ApiProperty()
  canSeeWhoLikedYou: boolean;

  @ApiProperty()
  prioritySupport: boolean;

  @ApiProperty()
  profileBadge: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  displayOrder: number;
}

export class SubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: SubscriptionPlanResponseDto })
  plan: SubscriptionPlanResponseDto;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  autoRenew: boolean;

  @ApiProperty({ enum: BillingCycle })
  billingCycle: BillingCycle;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SubscriptionHistoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  subscriptionId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: SubscriptionPlanResponseDto })
  plan: SubscriptionPlanResponseDto;

  @ApiProperty()
  action: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  createdAt: Date;
}
