export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        email: string;
        chartNumber: string;
    };
    timestamp: string;
}
export interface VerifyResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        email: string;
        isVerified: boolean;
        access_token: string;
        refresh_token: string;
    };
    timestamp: string;
}
export interface ResendResponse {
    success: boolean;
    message: string;
    data: {
        email: string;
        expiresAt: Date;
    };
    timestamp: string;
}
export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        fullName: string;
        email: string;
        gender: string;
        chartNumber: string;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        access_token: string;
        refresh_token: string;
    };
    timestamp: string;
}
export interface ForgetPasswordResponse {
    success: boolean;
    message: string;
    data: {
        email: string;
        expiresAt: Date;
    };
    timestamp: string;
}
export interface VerifyResetOtpResponse {
    success: boolean;
    message: string;
    data: {
        email: string;
        isVerified: boolean;
        access_token: string;
        refresh_token: string;
    };
    timestamp: string;
}
export interface ResetPasswordResponse {
    success: boolean;
    message: string;
    timestamp: string;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
    error: {
        code: string;
        details: string[];
    };
    timestamp: string;
}
