import { Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { SubscriptionHistory } from '../entities/subscription-history.entity';
import { PaymentService } from './payment.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpgradeSubscriptionDto } from '../dto/upgrade-subscription.dto';
export declare class SubscriptionsService {
    private subscriptionRepository;
    private subscriptionPlanRepository;
    private subscriptionHistoryRepository;
    private paymentService;
    private readonly logger;
    constructor(subscriptionRepository: Repository<Subscription>, subscriptionPlanRepository: Repository<SubscriptionPlan>, subscriptionHistoryRepository: Repository<SubscriptionHistory>, paymentService: PaymentService);
    getAllPlans(): Promise<SubscriptionPlan[]>;
    getMySubscription(userId: string): Promise<Subscription | null>;
    createSubscription(userId: string, createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription>;
    cancelSubscription(userId: string): Promise<Subscription>;
    upgradeSubscription(userId: string, upgradeSubscriptionDto: UpgradeSubscriptionDto): Promise<Subscription>;
    getSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]>;
    checkExpiredSubscriptions(): Promise<void>;
    private createHistoryRecord;
}
