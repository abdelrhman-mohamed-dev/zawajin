import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingPreferences } from './entities/matching-preferences.entity';
import { User } from '../auth/entities/user.entity';
import { MatchingService } from './services/matching.service';
import { MatchingController } from './controllers/matching.controller';
import { MatchingPreferencesRepository } from './repositories/matching-preferences.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MatchingPreferences, User])],
  controllers: [MatchingController],
  providers: [MatchingService, MatchingPreferencesRepository],
  exports: [MatchingService],
})
export class MatchingModule {}
