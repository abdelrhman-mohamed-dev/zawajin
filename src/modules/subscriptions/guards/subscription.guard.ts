import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionsService } from '../services/subscriptions.service';
import { SubscriptionStatus } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Get required subscription features from decorator
    const requiredFeatures = this.reflector.get<string[]>(
      'requiresSubscription',
      context.getHandler(),
    );

    if (!requiredFeatures || requiredFeatures.length === 0) {
      return true;
    }

    // Get user's active subscription
    const subscription = await this.subscriptionsService.getMySubscription(
      user.userId,
    );

    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new ForbiddenException({
        message: 'This feature requires an active subscription',
        messageAr: 'هذه الميزة تتطلب اشتراك نشط',
      });
    }

    // Check if user's plan has all required features
    const plan = subscription.plan;

    for (const feature of requiredFeatures) {
      switch (feature) {
        case 'canSendMessages':
          if (!plan.canSendMessages) {
            throw new ForbiddenException({
              message: 'Your subscription plan does not include messaging',
              messageAr: 'خطة اشتراكك لا تشمل المراسلة',
            });
          }
          break;
        case 'canViewLikes':
          if (!plan.canViewLikes) {
            throw new ForbiddenException({
              message: 'Your subscription plan does not include viewing likes',
              messageAr: 'خطة اشتراكك لا تشمل عرض الإعجابات',
            });
          }
          break;
        case 'canSeeWhoLikedYou':
          if (!plan.canSeeWhoLikedYou) {
            throw new ForbiddenException({
              message: 'Your subscription plan does not include seeing who liked you',
              messageAr: 'خطة اشتراكك لا تشمل معرفة من أعجب بك',
            });
          }
          break;
        default:
          break;
      }
    }

    return true;
  }
}
