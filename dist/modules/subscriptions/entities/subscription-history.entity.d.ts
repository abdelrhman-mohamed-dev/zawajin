import { User } from '../../auth/entities/user.entity';
import { Subscription } from './subscription.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
export declare enum SubscriptionAction {
    CREATED = "created",
    UPGRADED = "upgraded",
    DOWNGRADED = "downgraded",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    RENEWED = "renewed"
}
export declare class SubscriptionHistory {
    id: string;
    subscriptionId: string;
    subscription: Subscription;
    userId: string;
    user: User;
    planId: string;
    plan: SubscriptionPlan;
    action: SubscriptionAction;
    amount: number;
    paymentMethod: string;
    createdAt: Date;
}
