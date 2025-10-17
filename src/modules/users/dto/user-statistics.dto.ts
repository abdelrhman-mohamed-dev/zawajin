import { ApiProperty } from '@nestjs/swagger';

export class UserStatisticsDto {
  @ApiProperty({
    description: 'Total number of male users',
    example: 1250,
  })
  totalMaleUsers: number;

  @ApiProperty({
    description: 'Total number of female users',
    example: 980,
  })
  totalFemaleUsers: number;

  @ApiProperty({
    description: 'Number of male users online today',
    example: 45,
  })
  onlineMaleUsersToday: number;

  @ApiProperty({
    description: 'Number of female users online today',
    example: 38,
  })
  onlineFemaleUsersToday: number;
}
