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
var SubscriptionCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const subscriptions_service_1 = require("./subscriptions.service");
let SubscriptionCronService = SubscriptionCronService_1 = class SubscriptionCronService {
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
        this.logger = new common_1.Logger(SubscriptionCronService_1.name);
    }
    async checkExpiredSubscriptions() {
        this.logger.log('Running subscription expiration check...');
        try {
            await this.subscriptionsService.checkExpiredSubscriptions();
            this.logger.log('Subscription expiration check completed');
        }
        catch (error) {
            this.logger.error('Error checking expired subscriptions:', error);
        }
    }
};
exports.SubscriptionCronService = SubscriptionCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionCronService.prototype, "checkExpiredSubscriptions", null);
exports.SubscriptionCronService = SubscriptionCronService = SubscriptionCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionCronService);
//# sourceMappingURL=subscription-cron.service.js.map