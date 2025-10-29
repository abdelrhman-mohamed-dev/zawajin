import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const mailConfig: any = {
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    };

    this.transporter = nodemailer.createTransport(mailConfig);

    // Log configuration for debugging (without password)
    this.logger.log(`Mail service initialized with host: ${mailConfig.host}, port: ${mailConfig.port}, user: ${mailConfig.auth.user}`);
  }

  async sendOtpEmail(to: string, otpCode: string): Promise<boolean> {
    try {
      const template = await this.loadTemplate('register.template.html');
      const htmlContent = this.replaceVariables(template, [otpCode]);

      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM', 'Zawaj <noreply@zawaj.com>'),
        to,
        subject: 'Email Verification - Zawaj-In | تحقق من البريد الإلكتروني - زواج إن',
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent successfully to ${to}. Message ID: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, fullName: string, chartNumber: string): Promise<boolean> {
    try {
      const template = await this.loadTemplate('welcome.template.html');
      const htmlContent = this.replaceVariables(template, [fullName, chartNumber]);

      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM', 'Zawaj <noreply@zawaj.com>'),
        to,
        subject: 'Welcome to Zawaj-In! | مرحباً بك في زواج إن!',
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent successfully to ${to}. Message ID: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}:`, error);
      return false;
    }
  }

  async sendPasswordResetEmail(to: string, otpCode: string, fullName: string): Promise<boolean> {
    try {
      const template = await this.loadTemplate('password-reset.template.html');
      const htmlContent = this.replaceVariables(template, [fullName, otpCode]);

      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM', 'Zawaj <noreply@zawaj.com>'),
        to,
        subject: 'Password Reset Request - Zawaj-In | طلب إعادة تعيين كلمة المرور - زواج إن',
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent successfully to ${to}. Message ID: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}:`, error);
      return false;
    }
  }

  async sendAdminNotification(to: string, subject: string, message: string): Promise<boolean> {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9fafb; }
            .message { background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Zawaj-In Admin Notification</h1>
            </div>
            <div class="content">
              <div class="message">
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Zawaj-In. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM', 'Zawaj <noreply@zawaj.com>'),
        to,
        subject: subject,
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Admin notification sent successfully to ${to}. Message ID: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send admin notification to ${to}:`, error);
      return false;
    }
  }

  private async loadTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = path.join(process.cwd(), 'src', 'templates', templateName);
      return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      this.logger.error(`Failed to load template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  private replaceVariables(template: string, variables: string[]): string {
    let result = template;
    variables.forEach((variable, index) => {
      const placeholder = `[[${index}]]`;
      // Use global replace to replace all occurrences
      result = result.replace(new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'g'), variable);
    });
    return result;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Mail service connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to verify mail service connection:', error);
      return false;
    }
  }
}