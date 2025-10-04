import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        token,
      };

      const response = await admin.messaging().send(message);
      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendMulticastNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}