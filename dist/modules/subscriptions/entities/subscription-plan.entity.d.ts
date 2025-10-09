export declare class SubscriptionPlan {
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
    createdAt: Date;
    updatedAt: Date;
}
