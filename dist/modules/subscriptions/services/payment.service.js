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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PaymentService_1.name);
        this.mockPaymentEnabled = this.configService.get('MOCK_PAYMENT_ENABLED', true);
        this.mockPaymentSuccessRate = this.configService.get('MOCK_PAYMENT_SUCCESS_RATE', 0.95);
    }
    async processPayment(amount, currency = 'USD') {
        this.logger.log(`Processing payment: ${amount} ${currency}`);
        await this.delay(1000);
        const isSuccess = Math.random() <= this.mockPaymentSuccessRate;
        const transactionId = `TXN_${(0, uuid_1.v4)()}`;
        const result = {
            success: isSuccess,
            transactionId,
            message: isSuccess
                ? 'Payment processed successfully'
                : 'Payment failed - insufficient funds',
            amount,
            currency,
            processedAt: new Date(),
        };
        this.logger.log(`Payment ${isSuccess ? 'succeeded' : 'failed'}: ${transactionId}`);
        return result;
    }
    async verifyTransaction(transactionId) {
        return transactionId.startsWith('TXN_');
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    isEnabled() {
        return this.mockPaymentEnabled;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map