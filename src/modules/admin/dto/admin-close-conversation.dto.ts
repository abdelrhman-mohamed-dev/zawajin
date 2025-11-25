import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminCloseConversationDto {
  @ApiProperty({
    example: 'Conversation closed due to policy violation',
    description: 'Reason for closing the conversation',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reason: string;
}
