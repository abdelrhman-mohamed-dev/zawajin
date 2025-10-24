import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../services/chat.service';
import { UserPresenceRepository } from '../repositories/user-presence.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { SendEngagementDto } from '../dto/send-engagement.dto';
import { RespondEngagementDto } from '../dto/respond-engagement.dto';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    private userPresenceRepository;
    private jwtService;
    server: Server;
    private logger;
    private typingUsers;
    constructor(chatService: ChatService, userPresenceRepository: UserPresenceRepository, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    private extractTokenFromHandshake;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinConversation(client: Socket, data: {
        conversationId: string;
    }): Promise<{
        success: boolean;
        conversationId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        conversationId?: undefined;
    }>;
    handleLeaveConversation(client: Socket, data: {
        conversationId: string;
    }): Promise<{
        success: boolean;
        conversationId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        conversationId?: undefined;
    }>;
    handleSendMessage(client: Socket, data: {
        conversationId: string;
        message: SendMessageDto;
    }): Promise<{
        success: boolean;
        message: import("../entities/message.entity").Message;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    handleTypingStart(client: Socket, data: {
        conversationId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    handleTypingStop(client: Socket, data: {
        conversationId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    handleMessageRead(client: Socket, data: {
        conversationId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    broadcastNotification(userId: string, notification: {
        id?: string;
        type: string;
        title: string;
        body: string;
        data?: Record<string, any>;
        timestamp?: string;
    }): void;
    broadcastUserStatusChange(userId: string, isOnline: boolean): void;
    handleSendEngagementRequest(client: Socket, data: SendEngagementDto): Promise<{
        success: boolean;
        request: import("../entities/engagement-request.entity").EngagementRequest;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        request?: undefined;
    }>;
    handleRespondEngagementRequest(client: Socket, data: {
        requestId: string;
        response: RespondEngagementDto;
    }): Promise<{
        success: boolean;
        request: import("../entities/engagement-request.entity").EngagementRequest;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        request?: undefined;
    }>;
    handleCancelEngagementRequest(client: Socket, data: {
        requestId: string;
        recipientId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
}
