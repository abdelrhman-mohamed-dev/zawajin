import { Repository } from 'typeorm';
import { ConversationRepository } from '../repositories/conversation.repository';
import { MessageRepository } from '../repositories/message.repository';
import { UserPresenceRepository } from '../repositories/user-presence.repository';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { Like } from '../../interactions/entities/like.entity';
import { Block } from '../../interactions/entities/block.entity';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { SendMessageDto } from '../dto/send-message.dto';
export declare class ChatService {
    private conversationRepository;
    private messageRepository;
    private userPresenceRepository;
    private likeRepository;
    private blockRepository;
    constructor(conversationRepository: ConversationRepository, messageRepository: MessageRepository, userPresenceRepository: UserPresenceRepository, likeRepository: Repository<Like>, blockRepository: Repository<Block>);
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
    getUnreadCount(userId: string, conversationId: string): Promise<number>;
    getUserPresence(userId: string): Promise<any>;
    private checkMutualLike;
}
