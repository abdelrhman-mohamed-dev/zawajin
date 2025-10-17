import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SetUserStatusDto {
  @ApiProperty({
    description: 'Set user online status',
    example: true,
  })
  @IsBoolean({ message: 'Online status must be true or false / حالة الاتصال يجب أن تكون صحيحة أو خاطئة' })
  isOnline: boolean;
}
