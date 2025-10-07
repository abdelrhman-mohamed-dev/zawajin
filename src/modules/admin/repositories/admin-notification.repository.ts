import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminNotification } from '../entities/admin-notification.entity';

@Injectable()
export class AdminNotificationRepository {
  constructor(
    @InjectRepository(AdminNotification)
    private readonly repository: Repository<AdminNotification>,
  ) {}

  async create(
    notificationData: Partial<AdminNotification>,
  ): Promise<AdminNotification> {
    const notification = this.repository.create(notificationData);
    return this.repository.save(notification);
  }

  async findById(id: string): Promise<AdminNotification | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['recipient', 'sender'],
    });
  }

  async findByRecipient(
    recipientId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ notifications: AdminNotification[]; total: number }> {
    const [notifications, total] = await this.repository.findAndCount({
      where: { recipientId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { notifications, total };
  }

  async update(
    id: string,
    updateData: Partial<AdminNotification>,
  ): Promise<AdminNotification | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }
}
