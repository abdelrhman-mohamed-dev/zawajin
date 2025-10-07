import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SubscriptionPlan } from '../../modules/subscriptions/entities/subscription-plan.entity';
import { User } from '../../modules/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, User])],
  controllers: [SeedController],
})
export class SeedModule {}
