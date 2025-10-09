import { AdminSubscriptionService } from '../services/admin-subscription.service';
import { CreatePlanDto } from '../../subscriptions/dto/create-plan.dto';
import { UpdatePlanDto } from '../../subscriptions/dto/update-plan.dto';
export declare class AdminSubscriptionController {
    private readonly adminSubscriptionService;
    constructor(adminSubscriptionService: AdminSubscriptionService);
    getAllPlans(req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../subscriptions/entities/subscription-plan.entity").SubscriptionPlan[];
    }>;
    getAllSubscriptions(page: number, limit: number, req: any): Promise<{
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
                status: import("../../subscriptions/entities/subscription.entity").SubscriptionStatus;
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
    createPlan(createPlanDto: CreatePlanDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../subscriptions/entities/subscription-plan.entity").SubscriptionPlan;
    }>;
    updatePlan(id: string, updatePlanDto: UpdatePlanDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../subscriptions/entities/subscription-plan.entity").SubscriptionPlan;
    }>;
    deactivatePlan(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("../../subscriptions/entities/subscription-plan.entity").SubscriptionPlan;
    }>;
}
