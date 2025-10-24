import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { FirebaseService } from '../../../services/firebase.service';
import { ChatGateway } from '../../chat/gateways/chat.gateway';
import { UserPresenceRepository } from '../../chat/repositories/user-presence.repository';

export enum NotificationType {
  NEW_MESSAGE = 'new_message',
  NEW_MATCH = 'new_match',
  NEW_LIKE = 'new_like',
  ENGAGEMENT_REQUEST = 'engagement_request',
  ENGAGEMENT_RESPONSE = 'engagement_response',
  PROFILE_VIEW = 'profile_view',
  SYSTEM = 'system',
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
    private readonly userPresenceRepository: UserPresenceRepository,
  ) {}

  /**
   * Send notification to a user via socket (if online) and/or FCM (if offline or fallback)
   * @param userId - Target user ID
   * @param fcmToken - User's FCM token (optional, for push notifications)
   * @param notification - Notification payload
   * @param forcePush - Force FCM push even if user is online
   */
  async sendNotification(
    userId: string,
    fcmToken: string | null,
    notification: NotificationPayload,
    forcePush: boolean = false,
  ): Promise<{ socketSent: boolean; pushSent: boolean }> {
    this.logger.log(`Sending notification to user ${userId}: ${notification.type}`);

    let socketSent = false;
    let pushSent = false;

    // Check if user is online
    const presence = await this.userPresenceRepository.getUserPresence(userId);
    const isOnline = presence?.isOnline || false;

    // Always send via socket if user is online
    if (isOnline) {
      try {
        this.chatGateway.broadcastNotification(userId, {
          type: notification.type,
          title: notification.title,
          body: notification.body,
          data: notification.data,
        });
        socketSent = true;
        this.logger.log(`Socket notification sent to user ${userId}`);
      } catch (error) {
        this.logger.error(`Failed to send socket notification: ${error.message}`);
      }
    }

    // Send FCM push if:
    // 1. User is offline, OR
    // 2. forcePush is true, OR
    // 3. Socket send failed
    if ((!isOnline || forcePush || !socketSent) && fcmToken) {
      try {
        const fcmData: Record<string, string> = {
          type: notification.type,
          ...(notification.data || {}),
        };

        // Convert all data values to strings for FCM
        Object.keys(fcmData).forEach(key => {
          if (typeof fcmData[key] !== 'string') {
            fcmData[key] = JSON.stringify(fcmData[key]);
          }
        });

        const result = await this.firebaseService.sendNotification(
          fcmToken,
          notification.title,
          notification.body,
          fcmData,
        );

        pushSent = result.success;
        if (pushSent) {
          this.logger.log(`FCM push notification sent to user ${userId}`);
        } else {
          this.logger.warn(`FCM push notification failed for user ${userId}: ${result.error}`);
        }
      } catch (error) {
        this.logger.error(`Failed to send FCM notification: ${error.message}`);
      }
    }

    return { socketSent, pushSent };
  }

  /**
   * Send notification to multiple users
   */
  async sendBulkNotifications(
    recipients: Array<{ userId: string; fcmToken: string | null }>,
    notification: NotificationPayload,
  ): Promise<{
    socketSentCount: number;
    pushSentCount: number;
  }> {
    this.logger.log(`Sending bulk notifications to ${recipients.length} users`);

    let socketSentCount = 0;
    let pushSentCount = 0;

    const results = await Promise.allSettled(
      recipients.map(recipient =>
        this.sendNotification(recipient.userId, recipient.fcmToken, notification),
      ),
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value.socketSent) socketSentCount++;
        if (result.value.pushSent) pushSentCount++;
      } else {
        this.logger.error(
          `Failed to send notification to user ${recipients[index].userId}: ${result.reason}`,
        );
      }
    });

    this.logger.log(
      `Bulk notifications sent: ${socketSentCount} socket, ${pushSentCount} push`,
    );

    return { socketSentCount, pushSentCount };
  }

  /**
   * Send notification only via socket (no FCM fallback)
   */
  async sendSocketNotification(userId: string, notification: NotificationPayload): Promise<void> {
    this.logger.log(`Sending socket-only notification to user ${userId}: ${notification.type}`);

    try {
      this.chatGateway.broadcastNotification(userId, {
        type: notification.type,
        title: notification.title,
        body: notification.body,
        data: notification.data,
      });
      this.logger.log(`Socket notification sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to send socket notification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send notification only via FCM (no socket)
   */
  async sendPushNotification(
    fcmToken: string,
    notification: NotificationPayload,
  ): Promise<boolean> {
    this.logger.log(`Sending push-only notification: ${notification.type}`);

    try {
      const fcmData: Record<string, string> = {
        type: notification.type,
        ...(notification.data || {}),
      };

      // Convert all data values to strings for FCM
      Object.keys(fcmData).forEach(key => {
        if (typeof fcmData[key] !== 'string') {
          fcmData[key] = JSON.stringify(fcmData[key]);
        }
      });

      const result = await this.firebaseService.sendNotification(
        fcmToken,
        notification.title,
        notification.body,
        fcmData,
      );

      if (result.success) {
        this.logger.log(`FCM push notification sent successfully`);
      } else {
        this.logger.warn(`FCM push notification failed: ${result.error}`);
      }

      return result.success;
    } catch (error) {
      this.logger.error(`Failed to send FCM notification: ${error.message}`);
      throw error;
    }
  }
}
