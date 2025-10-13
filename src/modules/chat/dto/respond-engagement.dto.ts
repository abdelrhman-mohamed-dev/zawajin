import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EngagementStatus } from '../entities/engagement-request.entity';

export class RespondEngagementDto {
  @ApiProperty({
    description: 'Response to the engagement request',
    enum: [EngagementStatus.ACCEPTED, EngagementStatus.REFUSED],
    example: EngagementStatus.ACCEPTED,
  })
  @IsEnum([EngagementStatus.ACCEPTED, EngagementStatus.REFUSED])
  status: EngagementStatus.ACCEPTED | EngagementStatus.REFUSED;
}
