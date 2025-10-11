import { MessageType } from '../entities/message.entity';
export declare class SendMessageDto {
    content: string;
    messageType?: MessageType;
    fileUrl?: string;
    audioDuration?: number;
}
