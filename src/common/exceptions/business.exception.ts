import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode?: string,
  ) {
    const response = {
      success: false,
      message,
      error: {
        code: errorCode || 'BUSINESS_ERROR',
        details: [],
      },
      timestamp: new Date().toISOString(),
    };

    super(response, statusCode);
  }
}

export class ValidationException extends BusinessException {
  constructor(message: string, details: string[] = []) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR');
  }
}