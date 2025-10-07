import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResolveReportDto {
  @ApiProperty({
    description: 'Resolution description',
    example: 'User has been warned and content removed',
  })
  @IsString()
  resolution: string;

  @ApiPropertyOptional({
    description: 'Action taken',
    enum: [
      'no_action',
      'warning_sent',
      'user_suspended',
      'user_banned',
      'content_removed',
    ],
    example: 'warning_sent',
  })
  @IsOptional()
  @IsEnum([
    'no_action',
    'warning_sent',
    'user_suspended',
    'user_banned',
    'content_removed',
  ])
  actionTaken?: string;
}
