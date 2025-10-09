"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const subscriptions_service_1 = require("../services/subscriptions.service");
const subscription_entity_1 = require("../entities/subscription.entity");
let SubscriptionGuard = class SubscriptionGuard {
    constructor(reflector, subscriptionsService) {
        this.reflector = reflector;
        this.subscriptionsService = subscriptionsService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        const requiredFeatures = this.reflector.get('requiresSubscription', context.getHandler());
        if (!requiredFeatures || requiredFeatures.length === 0) {
            return true;
        }
        const subscription = await this.subscriptionsService.getMySubscription(user.userId);
        if (!subscription || subscription.status !== subscription_entity_1.SubscriptionStatus.ACTIVE) {
            throw new common_1.ForbiddenException({
                message: 'This feature requires an active subscription',
                messageAr: 'هذه الميزة تتطلب اشتراك نشط',
            });
        }
        const plan = subscription.plan;
        for (const feature of requiredFeatures) {
            switch (feature) {
                case 'canSendMessages':
                    if (!plan.canSendMessages) {
                        throw new common_1.ForbiddenException({
                            message: 'Your subscription plan does not include messaging',
                            messageAr: 'خطة اشتراكك لا تشمل المراسلة',
                        });
                    }
                    break;
                case 'canViewLikes':
                    if (!plan.canViewLikes) {
                        throw new common_1.ForbiddenException({
                            message: 'Your subscription plan does not include viewing likes',
                            messageAr: 'خطة اشتراكك لا تشمل عرض الإعجابات',
                        });
                    }
                    break;
                case 'canSeeWhoLikedYou':
                    if (!plan.canSeeWhoLikedYou) {
                        throw new common_1.ForbiddenException({
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
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        subscriptions_service_1.SubscriptionsService])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map