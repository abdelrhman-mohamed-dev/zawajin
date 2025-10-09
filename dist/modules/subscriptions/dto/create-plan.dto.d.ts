export declare class CreatePlanDto {
    name: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
    maxLikesPerDay?: number;
    canSendMessages: boolean;
    canViewLikes: boolean;
    canSeeWhoLikedYou: boolean;
    prioritySupport: boolean;
    profileBadge?: string;
    displayOrder: number;
}
