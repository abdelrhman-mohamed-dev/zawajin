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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST', 'smtp.gmail.com'),
            port: this.configService.get('MAIL_PORT', 587),
            secure: false,
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASSWORD'),
            },
        });
    }
    async sendOtpEmail(to, otpCode) {
        try {
            const template = await this.loadTemplate('register.template.html');
            const htmlContent = this.replaceVariables(template, [otpCode]);
            const mailOptions = {
                from: this.configService.get('MAIL_FROM', 'Zawaj <noreply@zawaj.com>'),
                to,
                subject: 'Email Verification - Zawaj-In | تحقق من البريد الإلكتروني - زواج إن',
                html: htmlContent,
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`OTP email sent successfully to ${to}. Message ID: ${result.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send OTP email to ${to}:`, error);
            return false;
        }
    }
    async sendWelcomeEmail(to, fullName, chartNumber) {
        try {
            const template = await this.loadTemplate('welcome.template.html');
            const htmlContent = this.replaceVariables(template, [fullName, chartNumber]);
            const mailOptions = {
                from: this.configService.get('MAIL_FROM', 'Zawaj <noreply@zawaj.com>'),
                to,
                subject: 'Welcome to Zawaj-In! | مرحباً بك في زواج إن!',
                html: htmlContent,
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Welcome email sent successfully to ${to}. Message ID: ${result.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send welcome email to ${to}:`, error);
            return false;
        }
    }
    async sendPasswordResetEmail(to, otpCode, fullName) {
        try {
            const template = await this.loadTemplate('password-reset.template.html');
            const htmlContent = this.replaceVariables(template, [fullName, otpCode]);
            const mailOptions = {
                from: this.configService.get('MAIL_FROM', 'Zawaj <noreply@zawaj.com>'),
                to,
                subject: 'Password Reset Request - Zawaj-In | طلب إعادة تعيين كلمة المرور - زواج إن',
                html: htmlContent,
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Password reset email sent successfully to ${to}. Message ID: ${result.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send password reset email to ${to}:`, error);
            return false;
        }
    }
    async sendAdminNotification(to, subject, message) {
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
                from: this.configService.get('MAIL_FROM', 'Zawaj <noreply@zawaj.com>'),
                to,
                subject: subject,
                html: htmlContent,
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Admin notification sent successfully to ${to}. Message ID: ${result.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send admin notification to ${to}:`, error);
            return false;
        }
    }
    async loadTemplate(templateName) {
        try {
            const templatePath = path.join(process.cwd(), 'src', 'templates', templateName);
            return fs.readFileSync(templatePath, 'utf-8');
        }
        catch (error) {
            this.logger.error(`Failed to load template ${templateName}:`, error);
            throw new Error(`Template ${templateName} not found`);
        }
    }
    replaceVariables(template, variables) {
        let result = template;
        variables.forEach((variable, index) => {
            const placeholder = `[[${index}]]`;
            result = result.replace(new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'g'), variable);
        });
        return result;
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('Mail service connection verified successfully');
            return true;
        }
        catch (error) {
            this.logger.error('Failed to verify mail service connection:', error);
            return false;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map