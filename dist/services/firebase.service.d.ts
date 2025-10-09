export declare class FirebaseService {
    sendNotification(token: string, title: string, body: string, data?: Record<string, string>): Promise<{
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    }>;
    sendMulticastNotification(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<{
        success: boolean;
        successCount: number;
        failureCount: number;
        responses: import("firebase-admin/lib/messaging/messaging-api").SendResponse[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        successCount?: undefined;
        failureCount?: undefined;
        responses?: undefined;
    }>;
}
