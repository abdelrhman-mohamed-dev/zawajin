export declare const APP_CONSTANTS: {
    readonly OTP: {
        readonly LENGTH: 6;
        readonly EXPIRY_MINUTES: 5;
        readonly MAX_ATTEMPTS: 3;
    };
    readonly PASSWORD: {
        readonly MIN_LENGTH: 8;
        readonly BCRYPT_ROUNDS: 12;
    };
    readonly JWT: {
        readonly DEFAULT_EXPIRY: "7d";
        readonly REFRESH_EXPIRY: "30d";
    };
    readonly VALIDATION: {
        readonly USERNAME_MIN_LENGTH: 3;
        readonly USERNAME_MAX_LENGTH: 20;
        readonly CHART_NUMBER_PREFIX_LENGTH: 6;
    };
};
