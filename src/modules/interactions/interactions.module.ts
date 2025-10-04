import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionsController } from './controllers/interactions.controller';
import { InteractionsService } from './services/interactions.service';
import { Like } from './entities/like.entity';
import { Block } from './entities/block.entity';
import { LikeRepository } from './repositories/like.repository';
import { BlockRepository } from './repositories/block.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Block]), AuthModule, UsersModule],
  controllers: [InteractionsController],
  providers: [InteractionsService, LikeRepository, BlockRepository],
  exports: [InteractionsService],
})
export class InteractionsModule {}
