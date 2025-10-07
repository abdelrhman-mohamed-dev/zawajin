import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogRepository {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly repository: Repository<ActivityLog>,
  ) {}

  async create(logData: Partial<ActivityLog>): Promise<ActivityLog> {
    const log = this.repository.create(logData);
    return this.repository.save(log);
  }

  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ logs: ActivityLog[]; total: number }> {
    const [logs, total] = await this.repository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { logs, total };
  }

  async findByActivityType(
    activityType: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ logs: ActivityLog[]; total: number }> {
    const [logs, total] = await this.repository.findAndCount({
      where: { activityType },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { logs, total };
  }

  async getRecentActivity(
    days: number = 7,
  ): Promise<{ activityType: string; count: string }[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.repository
      .createQueryBuilder('log')
      .select('log.activityType', 'activityType')
      .addSelect('COUNT(*)', 'count')
      .where('log.createdAt >= :date', { date })
      .groupBy('log.activityType')
      .orderBy('count', 'DESC')
      .getRawMany();
  }
}
