import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => value ? parseFloat(value) : value)
  priceMonthly: number;

  @ApiProperty()
  @Transform(({ value }) => value ? parseFloat(value) : value)
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
  @Transform(({ value }) => value ? parseFloat(value) : value)
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
  @Transform(({ value }) => value ? parseFloat(value) : value)
  amount: number;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  createdAt: Date;
}
