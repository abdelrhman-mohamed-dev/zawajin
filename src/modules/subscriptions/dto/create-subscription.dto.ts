import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Subscription plan ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  planId: string;

  @ApiProperty({
    description: 'Billing cycle (monthly or yearly)',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsNotEmpty()
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;
}
