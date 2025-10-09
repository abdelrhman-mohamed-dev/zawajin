import { SubscriptionsService } from '../services/subscriptions.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpgradeSubscriptionDto } from '../dto/upgrade-subscription.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    getAllPlans(): Promise<import("../entities/subscription-plan.entity").SubscriptionPlan[]>;
    getMySubscription(req: any): Promise<import("../entities/subscription.entity").Subscription>;
    createSubscription(req: any, createSubscriptionDto: CreateSubscriptionDto): Promise<import("../entities/subscription.entity").Subscription>;
    upgradeSubscription(req: any, upgradeSubscriptionDto: UpgradeSubscriptionDto): Promise<import("../entities/subscription.entity").Subscription>;
    cancelSubscription(req: any): Promise<import("../entities/subscription.entity").Subscription>;
    getSubscriptionHistory(req: any): Promise<import("../entities/subscription-history.entity").SubscriptionHistory[]>;
}
