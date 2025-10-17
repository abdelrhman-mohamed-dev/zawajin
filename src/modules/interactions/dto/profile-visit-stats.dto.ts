import { ApiProperty } from '@nestjs/swagger';

export class ProfileVisitStatsDto {
  @ApiProperty({
    description: 'Total number of profile visits',
    example: 150,
  })
  totalVisits: number;

  @ApiProperty({
    description: 'Number of unique visitors',
    example: 75,
  })
  uniqueVisitors: number;
}
