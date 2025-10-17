import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RecordVisitDto {
  @ApiProperty({
    description: 'Profile owner user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'Profile owner ID must be a valid UUID / معرف المستخدم يجب أن يكون UUID صحيح' })
  profileOwnerId: string;
}
