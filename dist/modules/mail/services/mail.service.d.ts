import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendOtpEmail(to: string, otpCode: string): Promise<boolean>;
    sendWelcomeEmail(to: string, fullName: string, chartNumber: string): Promise<boolean>;
    sendPasswordResetEmail(to: string, otpCode: string, fullName: string): Promise<boolean>;
    sendAdminNotification(to: string, subject: string, message: string): Promise<boolean>;
    private loadTemplate;
    private replaceVariables;
    verifyConnection(): Promise<boolean>;
}
