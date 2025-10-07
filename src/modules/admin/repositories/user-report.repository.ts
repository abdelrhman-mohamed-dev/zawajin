import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReport } from '../entities/user-report.entity';

@Injectable()
export class UserReportRepository {
  constructor(
    @InjectRepository(UserReport)
    private readonly repository: Repository<UserReport>,
  ) {}

  async create(reportData: Partial<UserReport>): Promise<UserReport> {
    const report = this.repository.create(reportData);
    return this.repository.save(report);
  }

  async findById(id: string): Promise<UserReport | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['reporter', 'reportedUser', 'reviewer'],
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    status?: string,
    priority?: string,
  ): Promise<{ reports: UserReport[]; total: number }> {
    const query = this.repository.createQueryBuilder('report');

    if (status) {
      query.andWhere('report.status = :status', { status });
    }

    if (priority) {
      query.andWhere('report.priority = :priority', { priority });
    }

    query
      .leftJoinAndSelect('report.reporter', 'reporter')
      .leftJoinAndSelect('report.reportedUser', 'reportedUser')
      .leftJoinAndSelect('report.reviewer', 'reviewer')
      .orderBy('report.priority', 'DESC')
      .addOrderBy('report.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [reports, total] = await query.getManyAndCount();

    return { reports, total };
  }

  async findByReportedUser(userId: string): Promise<UserReport[]> {
    return this.repository.find({
      where: { reportedUserId: userId },
      relations: ['reporter', 'reviewer'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateData: Partial<UserReport>,
  ): Promise<UserReport | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }
}
