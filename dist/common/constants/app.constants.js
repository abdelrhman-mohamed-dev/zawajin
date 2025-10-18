"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_CONSTANTS = void 0;
exports.APP_CONSTANTS = {
    OTP: {
        LENGTH: 6,
        EXPIRY_MINUTES: 5,
        MAX_ATTEMPTS: 3,
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        BCRYPT_ROUNDS: 12,
    },
    JWT: {
        DEFAULT_EXPIRY: '7d',
        REFRESH_EXPIRY: '30d',
    },
    VALIDATION: {
        USERNAME_MIN_LENGTH: 3,
        USERNAME_MAX_LENGTH: 20,
        CHART_NUMBER_PREFIX_LENGTH: 6,
    },
};
//# sourceMappingURL=app.constants.js.map