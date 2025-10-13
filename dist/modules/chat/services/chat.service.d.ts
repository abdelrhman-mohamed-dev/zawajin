import { Repository } from 'typeorm';
import { ConversationRepository } from '../repositories/conversation.repository';
import { MessageRepository } from '../repositories/message.repository';
import { UserPresenceRepository } from '../repositories/user-presence.repository';
import { EngagementRequestRepository } from '../repositories/engagement-request.repository';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { EngagementRequest } from '../entities/engagement-request.entity';
import { Like } from '../../interactions/entities/like.entity';
import { Block } from '../../interactions/entities/block.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { SendEngagementDto } from '../dto/send-engagement.dto';
import { RespondEngagementDto } from '../dto/respond-engagement.dto';
export declare class ChatService {
    private conversationRepository;
    private messageRepository;
    private userPresenceRepository;
    private engagementRequestRepository;
    private likeRepository;
    private blockRepository;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository, userPresenceRepository: UserPresenceRepository, engagementRequestRepository: EngagementRequestRepository, likeRepository: Repository<Like>, blockRepository: Repository<Block>);
    createConversation(userId: string, createConversationDto: CreateConversationDto): Promise<Conversation>;
    getUserConversations(userId: string, page?: number, limit?: number): Promise<{
        conversations: Conversation[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getConversationById(userId: string, conversationId: string): Promise<Conversation>;
    getConversationMessages(userId: string, conversationId: string, page?: number, limit?: number): Promise<{
        messages: Message[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    sendMessage(userId: string, conversationId: string, sendMessageDto: SendMessageDto): Promise<Message>;
    markMessagesAsRead(userId: string, conversationId: string): Promise<void>;
    deleteMessage(userId: string, messageId: string): Promise<void>;
    deleteConversation(userId: string, conversationId: string): Promise<void>;
    getUnreadCount(userId: string, conversationId: string): Promise<number>;
    getUserPresence(userId: string): Promise<any>;
    private checkMutualLike;
    sendEngagementRequest(userId: string, sendEngagementDto: SendEngagementDto): Promise<EngagementRequest>;
    respondToEngagementRequest(userId: string, requestId: string, respondDto: RespondEngagementDto): Promise<EngagementRequest>;
    cancelEngagementRequest(userId: string, requestId: string): Promise<void>;
    getSentEngagementRequests(userId: string, page?: number, limit?: number): Promise<{
        requests: EngagementRequest[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getReceivedEngagementRequests(userId: string, page?: number, limit?: number): Promise<{
        requests: EngagementRequest[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPendingEngagementRequests(userId: string): Promise<EngagementRequest[]>;
    getEngagementRequestById(userId: string, requestId: string): Promise<EngagementRequest>;
    getConversationEngagementRequests(userId: string, conversationId: string): Promise<EngagementRequest[]>;
    getPendingEngagementCount(userId: string): Promise<number>;
}
