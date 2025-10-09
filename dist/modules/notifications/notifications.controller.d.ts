import { FirebaseService } from '../../services/firebase.service';
import { SendPushNotificationDto } from './dto/send-notification.dto';
import { SendMulticastPushNotificationDto } from './dto/send-multicast-notification.dto';
export declare class NotificationsController {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    sendNotification(dto: SendPushNotificationDto): Promise<{
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    }>;
    sendMulticastNotification(dto: SendMulticastPushNotificationDto): Promise<{
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
