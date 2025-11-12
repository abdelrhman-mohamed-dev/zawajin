import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nContext } from 'nestjs-i18n';

/**
 * Interceptor to automatically translate enum values in API responses
 * based on the current language (from ?lang= query param or Accept-Language header)
 */
@Injectable()
export class TranslateResponseInterceptor implements NestInterceptor {
  // Map of enum field names to their translation keys in i18n files
  private readonly enumFieldMappings = {
    // Basic info
    gender: 'users.enums.gender',

    // Marriage and relationship
    marriageType: 'users.enums.marriage_type',
    tribe: 'users.enums.tribe',
    maritalStatus: 'users.enums.marital_status',
    polygamyStatus: 'users.enums.polygamy_status',

    // Education and work
    educationLevel: 'users.enums.education_level',
    natureOfWork: 'users.enums.employment_type',

    // Financial and health
    financialStatus: 'users.enums.financial_status',
    healthStatus: 'users.enums.health_status',
    religiosityLevel: 'users.enums.religiosity_level',

    // Physical attributes
    skinColor: 'users.enums.skin_color',
    beauty: 'users.enums.beauty',
    bodyColor: 'users.enums.body_color',
    hairColor: 'users.enums.hair_color',
    hairType: 'users.enums.hair_type',
    eyeColor: 'users.enums.eye_color',

    // Religious
    hijabStyle: 'users.enums.hijab_style',
    religiousPractice: 'users.enums.religious_practice',
    sect: 'users.enums.sect',
    prayerLevel: 'users.enums.prayer_level',
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const i18n = I18nContext.current();

    return next.handle().pipe(
      map(data => {
        // Only translate if i18n context is available and it's not English
        if (!i18n || i18n.lang === 'en') {
          return data;
        }

        return this.translateData(data, i18n);
      }),
    );
  }

  /**
   * Recursively translate enum values in the data
   */
  private translateData(data: any, i18n: I18nContext): any {
    if (!data) {
      return data;
    }

    // Handle Date objects - preserve them as-is
    if (data instanceof Date) {
      return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => this.translateData(item, i18n));
    }

    // Handle objects
    if (typeof data === 'object') {
      const translated = {};

      for (const [key, value] of Object.entries(data)) {
        // Check if this field is an enum that needs translation
        if (this.enumFieldMappings[key] && typeof value === 'string') {
          // Get the translation key for this enum
          const translationKey = `${this.enumFieldMappings[key]}.${value}`;
          const translatedValue = i18n.t(translationKey);

          // Only use translation if it exists (not the key itself)
          translated[key] = translatedValue !== translationKey ? translatedValue : value;
        } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
          // Recursively translate nested objects (but skip Date instances)
          translated[key] = this.translateData(value, i18n);
        } else {
          // Keep the value as is (including Date objects)
          translated[key] = value;
        }
      }

      return translated;
    }

    return data;
  }
}
