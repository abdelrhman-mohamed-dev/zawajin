import { ConfigService } from '@nestjs/config';
export interface PaymentResult {
    success: boolean;
    transactionId: string;
    message: string;
    amount: number;
    currency: string;
    processedAt: Date;
}
export declare class PaymentService {
    private configService;
    private readonly logger;
    private readonly mockPaymentEnabled;
    private readonly mockPaymentSuccessRate;
    constructor(configService: ConfigService);
    processPayment(amount: number, currency?: string): Promise<PaymentResult>;
    verifyTransaction(transactionId: string): Promise<boolean>;
    private delay;
    isEnabled(): boolean;
}
