import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../services/chat.service';
import { UserPresenceRepository } from '../repositories/user-presence.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { SendEngagementDto } from '../dto/send-engagement.dto';
import { RespondEngagementDto } from '../dto/respond-engagement.dto';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { MessageStatus } from '../entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN || '*',
    credentials: true,
  },
  path: process.env.SOCKET_IO_PATH || '/socket.io',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');
  private typingUsers = new Map<string, NodeJS.Timeout>();

  constructor(
    private chatService: ChatService,
    private userPresenceRepository: UserPresenceRepository,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract and verify JWT token
      const token = this.extractTokenFromHandshake(client);

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      let payload: any;
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
      } catch (error) {
        this.logger.warn(`Client ${client.id} has invalid token: ${error.message}`);
        client.disconnect();
        return;
      }

      // Set user data on socket
      const userId = payload.sub;
      client.data.userId = userId;
      client.data.email = payload.email;

      this.logger.log(`Client connected: ${client.id}, User: ${userId}`);

      // Join user to their personal room for private events
      client.join(`user:${userId}`);

      // Note: Online status is now managed manually via POST /users/status endpoint
      // Socket connection does not automatically set user online
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    // Try to get token from auth header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try to get token from auth object (socket.io auth)
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    if (token && typeof token === 'string') {
      return token;
    }

    return null;
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = client.data.userId;

      if (userId) {
        this.logger.log(`Client disconnected: ${client.id}, User: ${userId}`);

        // Clean up typing indicators
        this.typingUsers.delete(client.id);

        // Note: Online status is now managed manually via POST /users/status endpoint
        // Socket disconnection does not automatically set user offline
      }
    } catch (error) {
      this.logger.error(`Disconnect error: ${error.message}`);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const userId = client.data.userId;
      const { conversationId } = data;

      // Verify user has access to conversation
      await this.chatService.getConversationById(userId, conversationId);

      // Join conversation room
      client.join(`conversation:${conversationId}`);

      this.logger.log(
        `User ${userId} joined conversation ${conversationId}`,
      );

      return { success: true, conversationId };
    } catch (error) {
      this.logger.error(`Join conversation error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const { conversationId } = data;

      // Leave conversation room
      client.leave(`conversation:${conversationId}`);

      this.logger.log(
        `User ${client.data.userId} left conversation ${conversationId}`,
      );

      return { success: true, conversationId };
    } catch (error) {
      this.logger.error(`Leave conversation error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; message: SendMessageDto },
  ) {
    try {
      const userId = client.data.userId;
      const { conversationId, message } = data;

      // Send message through service
      const savedMessage = await this.chatService.sendMessage(
        userId,
        conversationId,
        message,
      );

      // Get conversation to find recipient
      const conversation = await this.chatService.getConversationById(
        userId,
        conversationId,
      );
      const recipientId = conversation.getOtherParticipantId(userId);

      // Emit message to conversation room
      this.server.to(`conversation:${conversationId}`).emit('message_received', {
        message: savedMessage,
        conversationId,
      });

      // Send delivery confirmation to sender
      client.emit('message_delivered', {
        messageId: savedMessage.id,
        conversationId,
      });

      // Check if recipient is online to send push notification if offline
      const recipientPresence = await this.userPresenceRepository.getUserPresence(
        recipientId,
      );

      if (!recipientPresence?.isOnline) {
        // TODO: Send push notification via FCM
        this.logger.log(
          `Recipient ${recipientId} is offline, should send push notification`,
        );
      }

      return { success: true, message: savedMessage };
    } catch (error) {
      this.logger.error(`Send message error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const userId = client.data.userId;
      const { conversationId } = data;

      // Clear existing timeout
      if (this.typingUsers.has(client.id)) {
        clearTimeout(this.typingUsers.get(client.id));
      }

      // Emit typing event to conversation room (excluding sender)
      client.to(`conversation:${conversationId}`).emit('user_typing', {
        userId,
        conversationId,
        isTyping: true,
      });

      // Auto-stop typing after timeout
      const timeout = setTimeout(() => {
        client.to(`conversation:${conversationId}`).emit('user_typing', {
          userId,
          conversationId,
          isTyping: false,
        });
        this.typingUsers.delete(client.id);
      }, parseInt(process.env.TYPING_TIMEOUT || '5000'));

      this.typingUsers.set(client.id, timeout);

      return { success: true };
    } catch (error) {
      this.logger.error(`Typing start error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const userId = client.data.userId;
      const { conversationId } = data;

      // Clear timeout
      if (this.typingUsers.has(client.id)) {
        clearTimeout(this.typingUsers.get(client.id));
        this.typingUsers.delete(client.id);
      }

      // Emit stop typing event
      client.to(`conversation:${conversationId}`).emit('user_typing', {
        userId,
        conversationId,
        isTyping: false,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Typing stop error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message_read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      const userId = client.data.userId;
      const { conversationId } = data;

      // Mark messages as read
      await this.chatService.markMessagesAsRead(userId, conversationId);

      // Get conversation to find sender
      const conversation = await this.chatService.getConversationById(
        userId,
        conversationId,
      );
      const senderId = conversation.getOtherParticipantId(userId);

      // Notify sender that messages were read
      this.server.to(`user:${senderId}`).emit('message_read', {
        conversationId,
        readBy: userId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Message read error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // ======================== NOTIFICATION EVENTS ========================

  /**
   * Broadcast notification to a specific user
   * Used for real-time in-app notifications
   */
  broadcastNotification(userId: string, notification: {
    id?: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    timestamp?: string;
  }) {
    this.server.to(`user:${userId}`).emit('notification_received', {
      ...notification,
      timestamp: notification.timestamp || new Date().toISOString(),
    });
    this.logger.log(`Notification sent to user ${userId}: ${notification.type}`);
  }

  /**
   * Broadcast online status change to all connected clients
   */
  broadcastUserStatusChange(userId: string, isOnline: boolean) {
    this.server.emit('user_status_changed', {
      userId,
      isOnline,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`User ${userId} status broadcasted: ${isOnline ? 'online' : 'offline'}`);
  }

  // ======================== ENGAGEMENT WEBSOCKET EVENTS ========================

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_engagement_request')
  async handleSendEngagementRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendEngagementDto,
  ) {
    try {
      const userId = client.data.userId;

      // Send engagement request through service
      const engagementRequest = await this.chatService.sendEngagementRequest(
        userId,
        data,
      );

      // Notify recipient about the engagement request
      this.server.to(`user:${data.recipientId}`).emit('engagement_request_received', {
        request: engagementRequest,
      });

      // Confirm to sender
      client.emit('engagement_request_sent', {
        request: engagementRequest,
      });

      this.logger.log(
        `Engagement request sent from ${userId} to ${data.recipientId}`,
      );

      return { success: true, request: engagementRequest };
    } catch (error) {
      this.logger.error(`Send engagement request error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('respond_engagement_request')
  async handleRespondEngagementRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { requestId: string; response: RespondEngagementDto },
  ) {
    try {
      const userId = client.data.userId;
      const { requestId, response } = data;

      // Respond to engagement request through service
      const updatedRequest = await this.chatService.respondToEngagementRequest(
        userId,
        requestId,
        response,
      );

      // Notify sender about the response
      this.server.to(`user:${updatedRequest.senderId}`).emit('engagement_request_responded', {
        request: updatedRequest,
        status: response.status,
      });

      // Confirm to recipient
      client.emit('engagement_response_sent', {
        request: updatedRequest,
        status: response.status,
      });

      this.logger.log(
        `Engagement request ${requestId} responded by ${userId} with status ${response.status}`,
      );

      return { success: true, request: updatedRequest };
    } catch (error) {
      this.logger.error(`Respond engagement request error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('cancel_engagement_request')
  async handleCancelEngagementRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { requestId: string; recipientId: string },
  ) {
    try {
      const userId = client.data.userId;
      const { requestId, recipientId } = data;

      // Cancel engagement request through service
      await this.chatService.cancelEngagementRequest(userId, requestId);

      // Notify recipient that request was cancelled
      this.server.to(`user:${recipientId}`).emit('engagement_request_cancelled', {
        requestId,
        senderId: userId,
      });

      // Confirm to sender
      client.emit('engagement_request_cancel_confirmed', {
        requestId,
      });

      this.logger.log(
        `Engagement request ${requestId} cancelled by ${userId}`,
      );

      return { success: true };
    } catch (error) {
      this.logger.error(`Cancel engagement request error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
