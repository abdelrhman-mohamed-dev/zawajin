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
exports.AdminReportService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const user_report_repository_1 = require("../repositories/user-report.repository");
const admin_action_repository_1 = require("../repositories/admin-action.repository");
let AdminReportService = class AdminReportService {
    constructor(userReportRepository, adminActionRepository, i18n) {
        this.userReportRepository = userReportRepository;
        this.adminActionRepository = adminActionRepository;
        this.i18n = i18n;
    }
    async getAllReports(page = 1, limit = 20, status, priority, lang = 'en') {
        const reports = await this.userReportRepository.findAll(page, limit, status, priority);
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.reportsFetched', { lang }),
            data: reports,
        };
    }
    async getReportById(reportId, lang = 'en') {
        const report = await this.userReportRepository.findById(reportId);
        if (!report) {
            throw new Error(await this.i18n.translate('admin.errors.reportNotFound', { lang }));
        }
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.reportFetched', { lang }),
            data: report,
        };
    }
    async createReport(reportData, reporterId, lang = 'en') {
        const report = await this.userReportRepository.create({
            ...reportData,
            reporterId,
        });
        return {
            success: true,
            message: 'Report created successfully',
            data: report,
        };
    }
    async reviewReport(reportId, adminId, lang = 'en') {
        const report = await this.userReportRepository.update(reportId, {
            status: 'under_review',
            reviewedBy: adminId,
            reviewedAt: new Date(),
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.reportReviewed', { lang }),
            data: report,
        };
    }
    async resolveReport(reportId, resolveData, adminId, lang = 'en') {
        const report = await this.userReportRepository.update(reportId, {
            status: 'resolved',
            resolution: resolveData.resolution,
            actionTaken: resolveData.actionTaken,
            reviewedBy: adminId,
            reviewedAt: new Date(),
        });
        await this.adminActionRepository.create({
            adminId,
            actionType: 'resolve_report',
            targetId: reportId,
            reason: resolveData.resolution,
            metadata: { actionTaken: resolveData.actionTaken },
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.reportResolved', { lang }),
            data: report,
        };
    }
    async dismissReport(reportId, adminId, lang = 'en') {
        const report = await this.userReportRepository.update(reportId, {
            status: 'dismissed',
            reviewedBy: adminId,
            reviewedAt: new Date(),
        });
        return {
            success: true,
            message: await this.i18n.translate('admin.messages.reportDismissed', { lang }),
            data: report,
        };
    }
};
exports.AdminReportService = AdminReportService;
exports.AdminReportService = AdminReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_report_repository_1.UserReportRepository,
        admin_action_repository_1.AdminActionRepository,
        nestjs_i18n_1.I18nService])
], AdminReportService);
//# sourceMappingURL=admin-report.service.js.map