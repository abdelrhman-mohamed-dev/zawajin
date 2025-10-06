import { IsString, IsNotEmpty, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from '../entities/message.entity';

export class SendMessageDto {
  @ApiProperty({
    description: 'The content of the message',
    example: 'Hello, how are you?',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, {
    message: 'Message content cannot exceed 2000 characters',
  })
  content: string;

  @ApiProperty({
    description: 'The type of message',
    enum: MessageType,
    default: MessageType.TEXT,
    required: false,
  })
  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType;
}
