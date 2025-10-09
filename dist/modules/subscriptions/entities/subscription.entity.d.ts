import { User } from '../../auth/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
export declare enum PaymentMethod {
    MOCK_PAYMENT = "mock_payment",
    STRIPE = "stripe",
    PAYPAL = "paypal"
}
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled",
    EXPIRED = "expired",
    PENDING = "pending"
}
export declare enum BillingCycle {
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
export declare class Subscription {
    id: string;
    userId: string;
    user: User;
    planId: string;
    plan: SubscriptionPlan;
    paymentMethod: PaymentMethod;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    billingCycle: BillingCycle;
    amount: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}
