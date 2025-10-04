export const APP_CONSTANTS = {
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
  RATE_LIMITS: {
    REGISTER: {
      LIMIT: 5,
      TTL: 3600000, // 1 hour
    },
    VERIFY_OTP: {
      LIMIT: 10,
      TTL: 3600000,
    },
    RESEND_OTP: {
      LIMIT: 3,
      TTL: 3600000,
    },
  },
  VALIDATION: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 20,
    CHART_NUMBER_PREFIX_LENGTH: 6,
  },
} as const;