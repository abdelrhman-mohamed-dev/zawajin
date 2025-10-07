import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminRolesDto {
  @ApiProperty({
    description: 'Array of permission strings',
    example: ['manage_users', 'manage_reports', 'view_analytics'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
