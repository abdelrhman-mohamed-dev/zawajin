import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
  amount: number;
  currency: string;
  processedAt: Date;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly mockPaymentEnabled: boolean;
  private readonly mockPaymentSuccessRate: number;

  constructor(private configService: ConfigService) {
    this.mockPaymentEnabled = this.configService.get<boolean>(
      'MOCK_PAYMENT_ENABLED',
      true,
    );
    this.mockPaymentSuccessRate = this.configService.get<number>(
      'MOCK_PAYMENT_SUCCESS_RATE',
      0.95,
    );
  }

  /**
   * Process payment
   * Currently uses mock payment, but can be extended to support real payment providers
   */
  async processPayment(
    amount: number,
    currency: string = 'USD',
  ): Promise<PaymentResult> {
    this.logger.log(
      `Processing payment: ${amount} ${currency}`,
    );

    // Simulate processing delay
    await this.delay(1000);

    // Determine success based on configured success rate
    const isSuccess = Math.random() <= this.mockPaymentSuccessRate;
    const transactionId = `TXN_${uuidv4()}`;

    const result: PaymentResult = {
      success: isSuccess,
      transactionId,
      message: isSuccess
        ? 'Payment processed successfully'
        : 'Payment failed - insufficient funds',
      amount,
      currency,
      processedAt: new Date(),
    };

    this.logger.log(
      `Payment ${isSuccess ? 'succeeded' : 'failed'}: ${transactionId}`,
    );

    return result;
  }

  /**
   * Verify if a transaction ID is valid
   */
  async verifyTransaction(transactionId: string): Promise<boolean> {
    return transactionId.startsWith('TXN_');
  }

  /**
   * Simulate a delay (for realistic payment processing)
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if mock payment is enabled
   */
  isEnabled(): boolean {
    return this.mockPaymentEnabled;
  }
}
