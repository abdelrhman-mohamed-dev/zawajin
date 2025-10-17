import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from '../auth/entities/user.entity';
import { Like } from '../interactions/entities/like.entity';
import { UserPresence } from '../chat/entities/user-presence.entity';
import { AuthModule } from '../auth/auth.module';
import { UserPresenceRepository } from '../chat/repositories/user-presence.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Like, UserPresence]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UserPresenceRepository],
  exports: [UsersService],
})
export class UsersModule {}
