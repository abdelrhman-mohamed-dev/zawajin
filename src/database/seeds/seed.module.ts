import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SubscriptionPlan } from '../../modules/subscriptions/entities/subscription-plan.entity';
import { User } from '../../modules/auth/entities/user.entity';
import { MatchingPreferences } from '../../modules/matching/entities/matching-preferences.entity';
import { Like } from '../../modules/interactions/entities/like.entity';
import { Conversation } from '../../modules/chat/entities/conversation.entity';
import { Message } from '../../modules/chat/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionPlan,
      User,
      MatchingPreferences,
      Like,
      Conversation,
      Message,
    ]),
  ],
  controllers: [SeedController],
})
export class SeedModule {}
