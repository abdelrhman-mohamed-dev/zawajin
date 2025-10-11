import { IsString, IsNotEmpty, MaxLength, IsEnum, IsOptional, IsUrl, IsInt, Min } from 'class-validator';
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

  @ApiProperty({
    description: 'URL to the file (for audio/image messages)',
    required: false,
    example: 'https://storage.example.com/audio/message.mp3',
  })
  @IsUrl()
  @IsOptional()
  fileUrl?: string;

  @ApiProperty({
    description: 'Duration of audio in seconds (for audio messages)',
    required: false,
    example: 45,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  audioDuration?: number;
}
