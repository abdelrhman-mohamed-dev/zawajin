import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { SubscriptionPlan } from '../../subscriptions/entities/subscription-plan.entity';
import { Subscription, SubscriptionStatus } from '../../subscriptions/entities/subscription.entity';
import { AdminAction } from '../entities/admin-action.entity';
import { CreatePlanDto } from '../../subscriptions/dto/create-plan.dto';
import { UpdatePlanDto } from '../../subscriptions/dto/update-plan.dto';
export declare class AdminSubscriptionService {
    private readonly subscriptionPlanRepository;
    private readonly subscriptionRepository;
    private readonly adminActionRepository;
    private readonly i18n;
    constructor(subscriptionPlanRepository: Repository<SubscriptionPlan>, subscriptionRepository: Repository<Subscription>, adminActionRepository: Repository<AdminAction>, i18n: I18nService);
    getAllSubscriptionPlans(lang?: string): Promise<{
        success: boolean;
        message: string;
        data: SubscriptionPlan[];
    }>;
    getAllSubscriptions(page?: number, limit?: number, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            subscriptions: {
                id: string;
                userId: string;
                userName: string;
                userEmail: string;
                planId: string;
                planName: string;
                status: SubscriptionStatus;
                billingCycle: import("../../subscriptions/entities/subscription.entity").BillingCycle;
                amount: number;
                currency: string;
                startDate: Date;
                endDate: Date;
                autoRenew: boolean;
                createdAt: Date;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    createPlan(createPlanDto: CreatePlanDto, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: SubscriptionPlan;
    }>;
    updatePlan(planId: string, updatePlanDto: UpdatePlanDto, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: SubscriptionPlan;
    }>;
    deactivatePlan(planId: string, adminId: string, lang?: string): Promise<{
        success: boolean;
        message: string;
        data: SubscriptionPlan;
    }>;
    private logAdminAction;
}
