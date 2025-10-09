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
exports.SubscriptionHistory = exports.SubscriptionAction = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../auth/entities/user.entity");
const subscription_entity_1 = require("./subscription.entity");
const subscription_plan_entity_1 = require("./subscription-plan.entity");
var SubscriptionAction;
(function (SubscriptionAction) {
    SubscriptionAction["CREATED"] = "created";
    SubscriptionAction["UPGRADED"] = "upgraded";
    SubscriptionAction["DOWNGRADED"] = "downgraded";
    SubscriptionAction["CANCELLED"] = "cancelled";
    SubscriptionAction["EXPIRED"] = "expired";
    SubscriptionAction["RENEWED"] = "renewed";
})(SubscriptionAction || (exports.SubscriptionAction = SubscriptionAction = {}));
let SubscriptionHistory = class SubscriptionHistory {
};
exports.SubscriptionHistory = SubscriptionHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SubscriptionHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SubscriptionHistory.prototype, "subscriptionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_entity_1.Subscription, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'subscriptionId' }),
    __metadata("design:type", subscription_entity_1.Subscription)
], SubscriptionHistory.prototype, "subscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SubscriptionHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], SubscriptionHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SubscriptionHistory.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_plan_entity_1.SubscriptionPlan),
    (0, typeorm_1.JoinColumn)({ name: 'planId' }),
    __metadata("design:type", subscription_plan_entity_1.SubscriptionPlan)
], SubscriptionHistory.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SubscriptionAction,
    }),
    __metadata("design:type", String)
], SubscriptionHistory.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubscriptionHistory.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], SubscriptionHistory.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SubscriptionHistory.prototype, "createdAt", void 0);
exports.SubscriptionHistory = SubscriptionHistory = __decorate([
    (0, typeorm_1.Entity)('subscription_history'),
    (0, typeorm_1.Index)(['userId', 'createdAt'])
], SubscriptionHistory);
//# sourceMappingURL=subscription-history.entity.js.map