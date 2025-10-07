import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { AdminReportService } from '../services/admin-report.service';
import { ResolveReportDto } from '../dto/resolve-report.dto';

@ApiTags('Admin - Report Management')
@ApiBearerAuth()
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('admin', 'super_admin')
export class AdminReportController {
  constructor(private readonly adminReportService: AdminReportService) {}

  @Get()
  @RequirePermissions('manage_reports')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all user reports' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'priority', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Reports fetched successfully' })
  async getAllReports(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Req() req?: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminReportService.getAllReports(page, limit, status, priority, lang);
  }

  @Get(':id')
  @RequirePermissions('manage_reports')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Get report details' })
  @ApiResponse({ status: 200, description: 'Report fetched successfully' })
  async getReportById(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminReportService.getReportById(id, lang);
  }

  @Put(':id/review')
  @RequirePermissions('manage_reports')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Mark report as reviewed' })
  @ApiResponse({ status: 200, description: 'Report marked as reviewed' })
  async reviewReport(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminReportService.reviewReport(id, adminId, lang);
  }

  @Put(':id/resolve')
  @RequirePermissions('manage_reports')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Resolve report with action' })
  @ApiResponse({ status: 200, description: 'Report resolved successfully' })
  async resolveReport(
    @Param('id') id: string,
    @Body() resolveData: ResolveReportDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminReportService.resolveReport(id, resolveData, adminId, lang);
  }

  @Put(':id/dismiss')
  @RequirePermissions('manage_reports')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Dismiss report' })
  @ApiResponse({ status: 200, description: 'Report dismissed successfully' })
  async dismissReport(@Param('id') id: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminReportService.dismissReport(id, adminId, lang);
  }
}
