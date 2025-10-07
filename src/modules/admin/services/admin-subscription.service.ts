import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { SubscriptionPlan } from '../../subscriptions/entities/subscription-plan.entity';
import { Subscription, SubscriptionStatus } from '../../subscriptions/entities/subscription.entity';
import { AdminAction } from '../entities/admin-action.entity';
import { CreatePlanDto } from '../../subscriptions/dto/create-plan.dto';
import { UpdatePlanDto } from '../../subscriptions/dto/update-plan.dto';

@Injectable()
export class AdminSubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(AdminAction)
    private readonly adminActionRepository: Repository<AdminAction>,
    private readonly i18n: I18nService,
  ) {}

  async getAllSubscriptionPlans(lang: string = 'en') {
    const plans = await this.subscriptionPlanRepository.find({
      order: { displayOrder: 'ASC' },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.subscriptionPlansFetched', { lang }),
      data: plans,
    };
  }

  async getAllSubscriptions(page: number = 1, limit: number = 20, lang: string = 'en') {
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await this.subscriptionRepository.findAndCount({
      relations: ['user', 'plan'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.subscriptionsFetched', { lang }),
      data: {
        subscriptions: subscriptions.map((sub) => ({
          id: sub.id,
          userId: sub.userId,
          userName: sub.user.fullName,
          userEmail: sub.user.email,
          planId: sub.planId,
          planName: sub.plan.name,
          status: sub.status,
          billingCycle: sub.billingCycle,
          amount: sub.amount,
          currency: sub.currency,
          startDate: sub.startDate,
          endDate: sub.endDate,
          autoRenew: sub.autoRenew,
          createdAt: sub.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async createPlan(createPlanDto: CreatePlanDto, adminId: string, lang: string = 'en') {
    // Check if plan with same name exists
    const existing = await this.subscriptionPlanRepository.findOne({
      where: { name: createPlanDto.name },
    });

    if (existing) {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.planAlreadyExists', { lang }),
      );
    }

    // Create new plan
    const plan = this.subscriptionPlanRepository.create({
      ...createPlanDto,
      isActive: true,
    });

    const savedPlan = await this.subscriptionPlanRepository.save(plan);

    // Log admin action
    await this.logAdminAction(
      adminId,
      'create_plan',
      null,
      savedPlan.id,
      'Created new subscription plan',
      { planName: savedPlan.name },
    );

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.planCreated', { lang }),
      data: savedPlan,
    };
  }

  async updatePlan(
    planId: string,
    updatePlanDto: UpdatePlanDto,
    adminId: string,
    lang: string = 'en',
  ) {
    const plan = await this.subscriptionPlanRepository.findOne({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.planNotFound', { lang }),
      );
    }

    // If updating name, check for duplicates
    if (updatePlanDto.name && updatePlanDto.name !== plan.name) {
      const existing = await this.subscriptionPlanRepository.findOne({
        where: { name: updatePlanDto.name },
      });

      if (existing) {
        throw new BadRequestException(
          await this.i18n.translate('admin.errors.planNameExists', { lang }),
        );
      }
    }

    // Update plan
    Object.assign(plan, updatePlanDto);
    const updatedPlan = await this.subscriptionPlanRepository.save(plan);

    // Log admin action
    await this.logAdminAction(
      adminId,
      'edit_plan',
      null,
      planId,
      'Updated subscription plan',
      { planName: plan.name, changes: updatePlanDto },
    );

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.planUpdated', { lang }),
      data: updatedPlan,
    };
  }

  async deactivatePlan(planId: string, adminId: string, lang: string = 'en') {
    const plan = await this.subscriptionPlanRepository.findOne({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(
        await this.i18n.translate('admin.errors.planNotFound', { lang }),
      );
    }

    // Check if there are active subscriptions using this plan
    const activeSubscriptionsCount = await this.subscriptionRepository.count({
      where: { planId, status: SubscriptionStatus.ACTIVE },
    });

    if (activeSubscriptionsCount > 0) {
      throw new BadRequestException(
        await this.i18n.translate('admin.errors.planHasActiveSubscriptions', {
          lang,
          args: { count: activeSubscriptionsCount },
        }),
      );
    }

    // Deactivate plan
    plan.isActive = false;
    await this.subscriptionPlanRepository.save(plan);

    // Log admin action
    await this.logAdminAction(
      adminId,
      'deactivate_plan',
      null,
      planId,
      'Deactivated subscription plan',
      { planName: plan.name },
    );

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.planDeactivated', { lang }),
      data: plan,
    };
  }

  private async logAdminAction(
    adminId: string,
    actionType: string,
    targetUserId: string | null,
    targetId: string,
    reason: string,
    metadata: any,
  ) {
    const action = this.adminActionRepository.create({
      adminId,
      actionType,
      targetUserId,
      targetId,
      reason,
      metadata,
    });

    await this.adminActionRepository.save(action);
  }
}
