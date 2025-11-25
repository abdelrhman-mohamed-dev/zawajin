import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { AdminSettingsService } from '../services/admin-settings.service';
import { CreateSystemSettingDto } from '../dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from '../dto/update-system-setting.dto';

@ApiTags('Admin - System Settings')
@ApiBearerAuth()
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('admin', 'super_admin')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get()
  @RequirePermissions('manage_settings')
  @ApiOperation({ summary: 'Get all system settings' })
  @ApiResponse({ status: 200, description: 'Settings fetched successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAllSettings(@Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminSettingsService.getAllSettings(lang);
  }

  @Get(':key')
  @RequirePermissions('manage_settings')
  @ApiOperation({ summary: 'Get a specific setting by key' })
  @ApiResponse({ status: 200, description: 'Setting fetched successfully' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getSettingByKey(@Param('key') key: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    return this.adminSettingsService.getSettingByKey(key, lang);
  }

  @Post()
  @RequirePermissions('manage_settings')
  @ApiOperation({ summary: 'Create a new system setting' })
  @ApiResponse({ status: 201, description: 'Setting created successfully' })
  @ApiResponse({ status: 409, description: 'Setting key already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createSetting(
    @Body() createDto: CreateSystemSettingDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminSettingsService.createSetting(createDto, adminId, lang);
  }

  @Put(':key')
  @RequirePermissions('manage_settings')
  @ApiOperation({ summary: 'Update an existing system setting' })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateSetting(
    @Param('key') key: string,
    @Body() updateDto: UpdateSystemSettingDto,
    @Req() req: any,
  ) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminSettingsService.updateSetting(key, updateDto, adminId, lang);
  }

  @Delete(':key')
  @RequirePermissions('manage_settings')
  @ApiOperation({ summary: 'Delete a system setting' })
  @ApiResponse({ status: 200, description: 'Setting deleted successfully' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteSetting(@Param('key') key: string, @Req() req: any) {
    const lang = req.headers['accept-language'] || 'en';
    const adminId = req.user.id;
    return this.adminSettingsService.deleteSetting(key, adminId, lang);
  }

  @Post('initialize')
  @RequirePermissions('manage_settings')
  @ApiOperation({ summary: 'Initialize default system settings' })
  @ApiResponse({ status: 200, description: 'Default settings initialized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async initializeDefaultSettings() {
    await this.adminSettingsService.initializeDefaultSettings();
    return {
      success: true,
      message: 'Default settings initialized successfully',
    };
  }
}
