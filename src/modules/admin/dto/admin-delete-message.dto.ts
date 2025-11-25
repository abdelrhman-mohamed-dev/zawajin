import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminDeleteMessageDto {
  @ApiProperty({
    example: 'Message violates community guidelines',
    description: 'Reason for deleting the message',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reason: string;
}
