import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AcceptTermsDto {
  @ApiProperty({
    description: 'Accept terms and policies',
    example: true,
  })
  @IsBoolean({ message: 'Terms acceptance must be true or false / قبول الشروط يجب أن يكون صحيح أو خطأ' })
  termsAccepted: boolean;
}
