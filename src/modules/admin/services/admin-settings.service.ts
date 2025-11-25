import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { SystemSettings } from '../entities/system-settings.entity';
import { CreateSystemSettingDto } from '../dto/create-system-setting.dto';
import { UpdateSystemSettingDto } from '../dto/update-system-setting.dto';
import { AdminActionRepository } from '../repositories/admin-action.repository';

@Injectable()
export class AdminSettingsService {
  constructor(
    @InjectRepository(SystemSettings)
    private systemSettingsRepository: Repository<SystemSettings>,
    private adminActionRepository: AdminActionRepository,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Initialize default system settings
   */
  async initializeDefaultSettings() {
    const defaultSettings = [
      {
        key: 'terms_of_use',
        valueEn: 'Terms of Use content goes here...',
        valueAr: 'محتوى شروط الاستخدام هنا...',
        type: 'html',
        description: 'Terms of Use page content',
      },
      {
        key: 'privacy_policy',
        valueEn: 'Privacy Policy content goes here...',
        valueAr: 'محتوى سياسة الخصوصية هنا...',
        type: 'html',
        description: 'Privacy Policy page content',
      },
      {
        key: 'about_us',
        valueEn: 'About Us content goes here...',
        valueAr: 'محتوى من نحن هنا...',
        type: 'html',
        description: 'About Us page content',
      },
      {
        key: 'contact_email',
        valueEn: 'support@zawaj.in',
        valueAr: 'support@zawaj.in',
        type: 'text',
        description: 'Contact email address',
      },
      {
        key: 'contact_phone',
        valueEn: '+1234567890',
        valueAr: '+1234567890',
        type: 'text',
        description: 'Contact phone number',
      },
    ];

    for (const setting of defaultSettings) {
      const exists = await this.systemSettingsRepository.findOne({
        where: { key: setting.key },
      });

      if (!exists) {
        await this.systemSettingsRepository.save(
          this.systemSettingsRepository.create(setting),
        );
      }
    }
  }

  /**
   * Get all system settings
   */
  async getAllSettings(lang: string = 'en') {
    const settings = await this.systemSettingsRepository.find({
      order: { key: 'ASC' },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.settingsFetched', { lang }),
      data: settings,
    };
  }

  /**
   * Get a specific setting by key
   */
  async getSettingByKey(key: string, lang: string = 'en') {
    const setting = await this.systemSettingsRepository.findOne({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException({
        message: await this.i18n.translate('admin.errors.settingNotFound', { lang }),
        messageAr: 'الإعداد غير موجود',
      });
    }

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.settingFetched', { lang }),
      data: setting,
    };
  }

  /**
   * Create a new system setting
   */
  async createSetting(
    createDto: CreateSystemSettingDto,
    adminId: string,
    lang: string = 'en',
  ) {
    // Check if key already exists
    const existing = await this.systemSettingsRepository.findOne({
      where: { key: createDto.key },
    });

    if (existing) {
      throw new ConflictException({
        message: await this.i18n.translate('admin.errors.settingKeyExists', { lang }),
        messageAr: 'مفتاح الإعداد موجود بالفعل',
      });
    }

    const setting = this.systemSettingsRepository.create(createDto);
    const savedSetting = await this.systemSettingsRepository.save(setting);

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'create_admin', // Using existing enum
      targetId: savedSetting.id,
      reason: `Created system setting: ${createDto.key}`,
      metadata: {
        action: 'create_setting',
        settingKey: createDto.key,
      },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.settingCreated', { lang }),
      data: savedSetting,
    };
  }

  /**
   * Update an existing system setting
   */
  async updateSetting(
    key: string,
    updateDto: UpdateSystemSettingDto,
    adminId: string,
    lang: string = 'en',
  ) {
    const setting = await this.systemSettingsRepository.findOne({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException({
        message: await this.i18n.translate('admin.errors.settingNotFound', { lang }),
        messageAr: 'الإعداد غير موجود',
      });
    }

    // Update fields
    Object.assign(setting, updateDto);
    const updatedSetting = await this.systemSettingsRepository.save(setting);

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'edit_user', // Using existing enum
      targetId: setting.id,
      reason: `Updated system setting: ${key}`,
      metadata: {
        action: 'update_setting',
        settingKey: key,
        changes: updateDto,
      },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.settingUpdated', { lang }),
      data: updatedSetting,
    };
  }

  /**
   * Delete a system setting
   */
  async deleteSetting(key: string, adminId: string, lang: string = 'en') {
    const setting = await this.systemSettingsRepository.findOne({
      where: { key },
    });

    if (!setting) {
      throw new NotFoundException({
        message: await this.i18n.translate('admin.errors.settingNotFound', { lang }),
        messageAr: 'الإعداد غير موجود',
      });
    }

    await this.systemSettingsRepository.remove(setting);

    // Log admin action
    await this.adminActionRepository.create({
      adminId,
      actionType: 'delete_user', // Using existing enum
      targetId: setting.id,
      reason: `Deleted system setting: ${key}`,
      metadata: {
        action: 'delete_setting',
        settingKey: key,
      },
    });

    return {
      success: true,
      message: await this.i18n.translate('admin.messages.settingDeleted', { lang }),
    };
  }

  /**
   * Get public settings (for mobile app/frontend)
   */
  async getPublicSettings(lang: string = 'en') {
    const settings = await this.systemSettingsRepository.find({
      where: { isActive: true },
      select: ['key', 'valueEn', 'valueAr', 'type'],
    });

    // Transform to a more frontend-friendly format
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        en: setting.valueEn,
        ar: setting.valueAr,
        type: setting.type,
      };
      return acc;
    }, {});

    return {
      success: true,
      data: settingsMap,
    };
  }

  /**
   * Get a specific public setting by key
   */
  async getPublicSettingByKey(key: string) {
    const setting = await this.systemSettingsRepository.findOne({
      where: { key, isActive: true },
      select: ['key', 'valueEn', 'valueAr', 'type'],
    });

    if (!setting) {
      throw new NotFoundException({
        message: 'Setting not found',
        messageAr: 'الإعداد غير موجود',
      });
    }

    return {
      success: true,
      data: {
        key: setting.key,
        en: setting.valueEn,
        ar: setting.valueAr,
        type: setting.type,
      },
    };
  }
}
