import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Decorator to add lang query parameter to Swagger documentation
 * This should be applied to all endpoints that support i18n
 */
export function ApiLangQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'lang',
      required: false,
      type: String,
      enum: ['en', 'ar'],
      description: 'Language for response messages (English or Arabic)',
      example: 'en',
    }),
  );
}
