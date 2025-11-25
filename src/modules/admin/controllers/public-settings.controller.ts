import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { AdminSettingsService } from '../services/admin-settings.service';

@ApiTags('Public - System Settings')
@Controller('settings')
@Public()
export class PublicSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public system settings (Terms, Privacy, About, etc.)' })
  @ApiResponse({ status: 200, description: 'Settings fetched successfully' })
  async getPublicSettings() {
    return this.adminSettingsService.getPublicSettings();
  }

  @Get(':key')
  @ApiOperation({
    summary: 'Get a specific public setting by key',
    description: 'Available keys: terms_of_use, privacy_policy, about_us, contact_email, contact_phone'
  })
  @ApiResponse({ status: 200, description: 'Setting fetched successfully' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async getPublicSettingByKey(@Param('key') key: string) {
    return this.adminSettingsService.getPublicSettingByKey(key);
  }
}
