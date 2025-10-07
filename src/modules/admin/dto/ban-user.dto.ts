import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BanUserDto {
  @ApiProperty({
    description: 'Ban type - temporary or permanent',
    enum: ['temporary', 'permanent'],
    example: 'temporary',
  })
  @IsEnum(['temporary', 'permanent'])
  banType: string;

  @ApiProperty({
    description: 'Reason for banning the user',
    example: 'Violating community guidelines',
  })
  @IsString()
  reason: string;

  @ApiPropertyOptional({
    description: 'Date until the ban is active (required for temporary bans)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  bannedUntil?: string;
}
