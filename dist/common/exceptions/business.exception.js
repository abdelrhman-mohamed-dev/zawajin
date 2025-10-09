"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.BusinessException = void 0;
const common_1 = require("@nestjs/common");
class BusinessException extends common_1.HttpException {
    constructor(message, statusCode = common_1.HttpStatus.BAD_REQUEST, errorCode) {
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
exports.BusinessException = BusinessException;
class ValidationException extends BusinessException {
    constructor(message, details = []) {
        super(message, common_1.HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR');
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=business.exception.js.map