import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAction } from '../entities/admin-action.entity';

@Injectable()
export class AdminActionRepository {
  constructor(
    @InjectRepository(AdminAction)
    private readonly repository: Repository<AdminAction>,
  ) {}

  async create(actionData: Partial<AdminAction>): Promise<AdminAction> {
    const action = this.repository.create(actionData);
    return this.repository.save(action);
  }

  async findByAdminId(
    adminId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ actions: AdminAction[]; total: number }> {
    const [actions, total] = await this.repository.findAndCount({
      where: { adminId },
      relations: ['targetUser'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { actions, total };
  }

  async findByTargetUserId(
    targetUserId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ actions: AdminAction[]; total: number }> {
    const [actions, total] = await this.repository.findAndCount({
      where: { targetUserId },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { actions, total };
  }

  async getRecentActions(
    days: number = 30,
  ): Promise<{ actionType: string; count: string }[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.repository
      .createQueryBuilder('action')
      .select('action.actionType', 'actionType')
      .addSelect('COUNT(*)', 'count')
      .where('action.createdAt >= :date', { date })
      .groupBy('action.actionType')
      .orderBy('count', 'DESC')
      .getRawMany();
  }
}
