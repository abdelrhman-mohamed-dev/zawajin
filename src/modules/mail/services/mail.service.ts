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
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
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