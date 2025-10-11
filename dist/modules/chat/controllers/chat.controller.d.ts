import { ChatService } from '../services/chat.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { PaginationDto } from '../dto/pagination.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createConversation(req: any, createConversationDto: CreateConversationDto): Promise<import("../entities/conversation.entity").Conversation>;
    getUserConversations(req: any, paginationDto: PaginationDto): Promise<{
        conversations: import("../entities/conversation.entity").Conversation[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getConversationById(req: any, id: string): Promise<import("../entities/conversation.entity").Conversation>;
    getConversationMessages(req: any, id: string, paginationDto: PaginationDto): Promise<{
        messages: import("../entities/message.entity").Message[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    sendMessage(req: any, id: string, sendMessageDto: SendMessageDto): Promise<import("../entities/message.entity").Message>;
    markMessagesAsRead(req: any, id: string): Promise<{
        message: string;
        messageAr: string;
    }>;
    deleteMessage(req: any, id: string): Promise<{
        message: string;
        messageAr: string;
    }>;
    deleteConversation(req: any, id: string): Promise<{
        message: string;
        messageAr: string;
    }>;
    getUnreadCount(req: any, id: string): Promise<{
        count: number;
    }>;
    getUserPresence(req: any, userId: string): Promise<any>;
}
