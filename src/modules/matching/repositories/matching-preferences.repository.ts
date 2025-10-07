import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchingPreferences } from '../entities/matching-preferences.entity';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';

@Injectable()
export class MatchingPreferencesRepository {
  constructor(
    @InjectRepository(MatchingPreferences)
    private readonly repository: Repository<MatchingPreferences>,
  ) {}

  async findByUserId(userId: string): Promise<MatchingPreferences | null> {
    return await this.repository.findOne({
      where: { userId },
    });
  }

  async createOrUpdate(
    userId: string,
    data: UpdatePreferencesDto,
  ): Promise<MatchingPreferences> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      Object.assign(existing, data);
      return await this.repository.save(existing);
    }

    const preferences = this.repository.create({
      userId,
      ...data,
    });

    return await this.repository.save(preferences);
  }

  async delete(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}
