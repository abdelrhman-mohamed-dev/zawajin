import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileVisit } from '../entities/profile-visit.entity';

@Injectable()
export class ProfileVisitRepository {
  constructor(
    @InjectRepository(ProfileVisit)
    private readonly profileVisitRepo: Repository<ProfileVisit>,
  ) {}

  async create(visitorId: string, profileOwnerId: string): Promise<ProfileVisit> {
    const visit = this.profileVisitRepo.create({ visitorId, profileOwnerId });
    return await this.profileVisitRepo.save(visit);
  }

  async findVisitsByProfileOwner(profileOwnerId: string): Promise<ProfileVisit[]> {
    return await this.profileVisitRepo.find({
      where: { profileOwnerId },
      relations: ['visitor'],
      order: { createdAt: 'DESC' },
    });
  }

  async countVisitsByProfileOwner(profileOwnerId: string): Promise<number> {
    return await this.profileVisitRepo.count({ where: { profileOwnerId } });
  }

  async countUniqueVisitorsByProfileOwner(profileOwnerId: string): Promise<number> {
    const result = await this.profileVisitRepo
      .createQueryBuilder('visit')
      .select('COUNT(DISTINCT visit.visitorId)', 'count')
      .where('visit.profileOwnerId = :profileOwnerId', { profileOwnerId })
      .getRawOne();

    return parseInt(result.count, 10) || 0;
  }

  async findRecentVisitors(profileOwnerId: string, limit: number = 10): Promise<ProfileVisit[]> {
    return await this.profileVisitRepo
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.visitor', 'visitor')
      .where('visit.profileOwnerId = :profileOwnerId', { profileOwnerId })
      .orderBy('visit.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getVisitorStats(profileOwnerId: string): Promise<{
    totalVisits: number;
    uniqueVisitors: number;
  }> {
    const totalVisits = await this.countVisitsByProfileOwner(profileOwnerId);
    const uniqueVisitors = await this.countUniqueVisitorsByProfileOwner(profileOwnerId);

    return {
      totalVisits,
      uniqueVisitors,
    };
  }

  async markAsSeen(profileOwnerId: string, visitorId: string): Promise<void> {
    await this.profileVisitRepo
      .createQueryBuilder()
      .update(ProfileVisit)
      .set({ seen: true })
      .where('profileOwnerId = :profileOwnerId', { profileOwnerId })
      .andWhere('visitorId = :visitorId', { visitorId })
      .execute();
  }

  async markAllAsSeen(profileOwnerId: string): Promise<void> {
    await this.profileVisitRepo
      .createQueryBuilder()
      .update(ProfileVisit)
      .set({ seen: true })
      .where('profileOwnerId = :profileOwnerId', { profileOwnerId })
      .andWhere('seen = :seen', { seen: false })
      .execute();
  }

  async countUnseenVisits(profileOwnerId: string): Promise<number> {
    return await this.profileVisitRepo.count({
      where: { profileOwnerId, seen: false },
    });
  }
}
