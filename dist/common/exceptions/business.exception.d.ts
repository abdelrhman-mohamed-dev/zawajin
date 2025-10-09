import { HttpException, HttpStatus } from '@nestjs/common';
export declare class BusinessException extends HttpException {
    constructor(message: string, statusCode?: HttpStatus, errorCode?: string);
}
export declare class ValidationException extends BusinessException {
    constructor(message: string, details?: string[]);
}
