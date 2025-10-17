import { ApiProperty } from '@nestjs/swagger';

export class VisitorDto {
  @ApiProperty({
    description: 'Visitor user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  visitorId: string;

  @ApiProperty({
    description: 'Visitor chart number',
    example: 'AB-123456',
  })
  chartNumber: string;

  @ApiProperty({
    description: 'Visitor full name',
    example: 'Ahmed Ali',
  })
  fullName: string;

  @ApiProperty({
    description: 'Visit timestamp',
    example: '2025-10-17T10:30:00Z',
  })
  visitedAt: Date;
}
