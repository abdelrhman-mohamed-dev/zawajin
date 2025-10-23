import { ChatService } from '../services/chat.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { SendEngagementDto } from '../dto/send-engagement.dto';
import { RespondEngagementDto } from '../dto/respond-engagement.dto';
import { PaginationDto } from '../dto/pagination.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createConversation(req: any, createConversationDto: CreateConversationDto): Promise<import("../entities/conversation.entity").Conversation>;
    getUserConversations(req: any, paginationDto: PaginationDto): Promise<{
        conversations: any[];
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
    sendEngagementRequest(req: any, sendEngagementDto: SendEngagementDto): Promise<import("../entities/engagement-request.entity").EngagementRequest>;
    respondToEngagementRequest(req: any, id: string, respondDto: RespondEngagementDto): Promise<import("../entities/engagement-request.entity").EngagementRequest>;
    cancelEngagementRequest(req: any, id: string): Promise<{
        message: string;
        messageAr: string;
    }>;
    getSentEngagementRequests(req: any, paginationDto: PaginationDto): Promise<{
        requests: import("../entities/engagement-request.entity").EngagementRequest[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getReceivedEngagementRequests(req: any, paginationDto: PaginationDto): Promise<{
        requests: import("../entities/engagement-request.entity").EngagementRequest[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPendingEngagementRequests(req: any): Promise<import("../entities/engagement-request.entity").EngagementRequest[]>;
    getPendingEngagementCount(req: any): Promise<{
        count: number;
    }>;
    getEngagementRequestById(req: any, id: string): Promise<import("../entities/engagement-request.entity").EngagementRequest>;
    getConversationEngagementRequests(req: any, id: string): Promise<import("../entities/engagement-request.entity").EngagementRequest[]>;
}
