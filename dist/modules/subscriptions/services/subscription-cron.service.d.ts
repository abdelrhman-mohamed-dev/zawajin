import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionCronService {
    private readonly subscriptionsService;
    private readonly logger;
    constructor(subscriptionsService: SubscriptionsService);
    checkExpiredSubscriptions(): Promise<void>;
}
