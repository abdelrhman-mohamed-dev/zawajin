import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/chat.service';
import { UserPresenceRepository } from '../repositories/user-presence.repository';
import { SendMessageDto } from '../dto/send-message.dto';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    private userPresenceRepository;
    server: Server;
    private logger;
    private typingUsers;
    constructor(chatService: ChatService, userPresenceRepository: UserPresenceRepository);
    handleConnection(client: Socket): Promise<void>;
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
}
