import { SubscriptionStatus, BillingCycle, PaymentMethod } from '../entities/subscription.entity';
export declare class SubscriptionPlanResponseDto {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
    maxLikesPerDay: number | null;
    canSendMessages: boolean;
    canViewLikes: boolean;
    canSeeWhoLikedYou: boolean;
    prioritySupport: boolean;
    profileBadge: string | null;
    isActive: boolean;
    displayOrder: number;
}
export declare class SubscriptionResponseDto {
    id: string;
    userId: string;
    plan: SubscriptionPlanResponseDto;
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
export declare class SubscriptionHistoryResponseDto {
    id: string;
    subscriptionId: string;
    userId: string;
    plan: SubscriptionPlanResponseDto;
    action: string;
    amount: number;
    paymentMethod: string;
    createdAt: Date;
}
