import { IsOptional, IsString, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ChatFilterStatus {
  ALL = 'all',
  REPORTED = 'reported',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export class AdminChatFilterDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: ChatFilterStatus, example: ChatFilterStatus.ALL })
  @IsOptional()
  @IsEnum(ChatFilterStatus)
  status?: ChatFilterStatus;

  @ApiProperty({ required: false, example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false, example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  hasReports?: boolean;
}
