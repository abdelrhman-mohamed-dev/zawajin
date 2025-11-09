import {
  ValidationPipe,
  ArgumentMetadata,
  BadRequestException,
  ValidationError
} from '@nestjs/common';

/**
 * Custom validation pipe that allows i18n query parameters (lang)
 * while maintaining strict validation for other fields
 */
export class CustomValidationPipe extends ValidationPipe {
  // List of query parameters that should be allowed globally
  // These are typically used by framework-level features (i18n, pagination, etc.)
  private readonly allowedGlobalParams = ['lang'];

  constructor(options?: any) {
    super({
      ...options,
      exceptionFactory: (errors: ValidationError[]) => {
        // Filter out errors for allowed global parameters
        const filteredErrors = errors.filter(error =>
          !this.allowedGlobalParams.includes(error.property)
        );

        // If there are still errors after filtering, throw them
        if (filteredErrors.length > 0) {
          const messages = filteredErrors.map(error =>
            Object.values(error.constraints || {}).join(', ')
          );
          return new BadRequestException({
            message: messages,
            error: 'Bad Request',
            statusCode: 400,
          });
        }

        // If all errors were for allowed params, don't throw
        return null;
      },
    });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    // Only process query parameters
    if (metadata.type === 'query' && value) {
      // Remove allowed global params before validation
      const filteredValue = { ...value };
      this.allowedGlobalParams.forEach(param => {
        delete filteredValue[param];
      });

      // Validate the filtered value
      const result = await super.transform(filteredValue, metadata);

      // Add back the allowed params to the result
      this.allowedGlobalParams.forEach(param => {
        if (value[param] !== undefined) {
          if (result) {
            result[param] = value[param];
          }
        }
      });

      return result || {};
    }

    // For non-query parameters, use default validation
    return super.transform(value, metadata);
  }
}
