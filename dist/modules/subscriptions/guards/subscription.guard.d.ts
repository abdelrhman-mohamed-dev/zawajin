import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionsService } from '../services/subscriptions.service';
export declare class SubscriptionGuard implements CanActivate {
    private reflector;
    private subscriptionsService;
    constructor(reflector: Reflector, subscriptionsService: SubscriptionsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
