import { User } from '../../auth/entities/user.entity';
import { Message } from './message.entity';
export declare class Conversation {
    id: string;
    participant1Id: string;
    participant1: User;
    participant2Id: string;
    participant2: User;
    matchId: string;
    lastMessageAt: Date;
    lastMessagePreview: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    isParticipant(userId: string): boolean;
    getOtherParticipantId(userId: string): string;
}
