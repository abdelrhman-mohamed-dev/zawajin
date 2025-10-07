import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserReportRepository } from '../repositories/user-report.repository';
import { AdminActionRepository } from '../repositories/admin-action.repository';
import { CreateReportDto } from '../dto/create-report.dto';
import { ResolveReportDto } from '../dto/resolve-report.dto';

@Injectable()
export class AdminReportService {
  constructor(
    private readonly userReportRepository: UserReportRepository,
    private readonly adminActionRepository: AdminActionRepository,
    private readonly i18n: I18nService,
  ) {}

  async getAllReports(
    page: number = 1,
    limit: number = 20,
    status?: string,
    priority?: string,
    lang: string = 'en',
  ) {
    const reports = await this.userReportRepository.findAll(page, limit, status, priority);

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.reportsFetched', { lang }),
      data: reports,
    };
  }

  async getReportById(reportId: string, lang: string = 'en') {
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

  async createReport(reportData: CreateReportDto, reporterId: string, lang: string = 'en') {
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

  async reviewReport(reportId: string, adminId: string, lang: string = 'en') {
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

  async resolveReport(reportId: string, resolveData: ResolveReportDto, adminId: string, lang: string = 'en') {
    const report = await this.userReportRepository.update(reportId, {
      status: 'resolved',
      resolution: resolveData.resolution,
      actionTaken: resolveData.actionTaken,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    });

    // Log admin action
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

  async dismissReport(reportId: string, adminId: string, lang: string = 'en') {
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
}
