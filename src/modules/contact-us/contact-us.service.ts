import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto';
import { FilterContactMessagesDto } from './dto/filter-contact-messages.dto';
import { User } from '../auth/entities/user.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactMessageRepository: Repository<ContactMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createContactMessageDto: CreateContactMessageDto,
    userId?: string,
    lang: string = 'en',
  ): Promise<ContactMessage> {
    // If user is authenticated, userId will be provided
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(
          this.i18n.t('contact-us.USER_NOT_FOUND', { lang }),
        );
      }

      const contactMessage = this.contactMessageRepository.create({
        ...createContactMessageDto,
        userId,
        email: user.email,
        name: user.fullName,
      });

      return await this.contactMessageRepository.save(contactMessage);
    }

    // For guest users, email and name are required
    if (!createContactMessageDto.email || !createContactMessageDto.name) {
      throw new BadRequestException(
        this.i18n.t('contact-us.EMAIL_AND_NAME_REQUIRED', { lang }),
      );
    }

    const contactMessage = this.contactMessageRepository.create(
      createContactMessageDto,
    );

    return await this.contactMessageRepository.save(contactMessage);
  }

  async findAll(
    filterDto: FilterContactMessagesDto,
  ): Promise<{ data: ContactMessage[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, ...filters } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contactMessageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('message.assignedToAdmin', 'admin');

    // Apply filters
    if (filters.status) {
      queryBuilder.andWhere('message.status = :status', {
        status: filters.status,
      });
    }

    if (filters.priority) {
      queryBuilder.andWhere('message.priority = :priority', {
        priority: filters.priority,
      });
    }

    if (filters.assignedToAdminId) {
      queryBuilder.andWhere('message.assignedToAdminId = :assignedToAdminId', {
        assignedToAdminId: filters.assignedToAdminId,
      });
    }

    if (filters.userId) {
      queryBuilder.andWhere('message.userId = :userId', {
        userId: filters.userId,
      });
    }

    queryBuilder
      .orderBy('message.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, lang: string = 'en'): Promise<ContactMessage> {
    const message = await this.contactMessageRepository.findOne({
      where: { id },
      relations: ['user', 'assignedToAdmin'],
    });

    if (!message) {
      throw new NotFoundException(
        this.i18n.t('contact-us.MESSAGE_NOT_FOUND', { lang }),
      );
    }

    return message;
  }

  async findMyMessages(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ContactMessage[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.contactMessageRepository.findAndCount({
      where: { userId },
      relations: ['assignedToAdmin'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    updateContactMessageDto: UpdateContactMessageDto,
    adminId: string,
    lang: string = 'en',
  ): Promise<ContactMessage> {
    const message = await this.findOne(id, lang);

    // Verify admin exists if assigning
    if (updateContactMessageDto.assignedToAdminId) {
      const admin = await this.userRepository.findOne({
        where: { id: updateContactMessageDto.assignedToAdminId },
      });

      if (!admin) {
        throw new NotFoundException(
          this.i18n.t('contact-us.ADMIN_NOT_FOUND', { lang }),
        );
      }
    }

    // Set respondedAt timestamp if admin response is provided
    if (updateContactMessageDto.adminResponse) {
      message.respondedAt = new Date();
    }

    Object.assign(message, updateContactMessageDto);

    return await this.contactMessageRepository.save(message);
  }

  async delete(id: string, lang: string = 'en'): Promise<void> {
    const message = await this.findOne(id, lang);
    await this.contactMessageRepository.remove(message);
  }

  async getStatistics(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
    averageResponseTime: number;
  }> {
    const total = await this.contactMessageRepository.count();

    const pending = await this.contactMessageRepository.count({
      where: { status: 'pending' as any },
    });

    const inProgress = await this.contactMessageRepository.count({
      where: { status: 'in_progress' as any },
    });

    const resolved = await this.contactMessageRepository.count({
      where: { status: 'resolved' as any },
    });

    const closed = await this.contactMessageRepository.count({
      where: { status: 'closed' as any },
    });

    // Calculate average response time
    const messagesWithResponse = await this.contactMessageRepository
      .createQueryBuilder('message')
      .where('message.respondedAt IS NOT NULL')
      .select('AVG(EXTRACT(EPOCH FROM (message.respondedAt - message.createdAt)))', 'avg')
      .getRawOne();

    const averageResponseTime = messagesWithResponse?.avg
      ? parseFloat(messagesWithResponse.avg)
      : 0;

    return {
      total,
      pending,
      inProgress,
      resolved,
      closed,
      averageResponseTime: Math.round(averageResponseTime / 3600), // Convert to hours
    };
  }
}
