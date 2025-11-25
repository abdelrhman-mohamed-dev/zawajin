import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SettingType {
  TEXT = 'text',
  HTML = 'html',
  JSON = 'json',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
}

export class UpdateSystemSettingDto {
  @ApiProperty({
    example: 'By using our service, you agree to...',
    description: 'Setting value in English',
    required: false,
  })
  @IsOptional()
  @IsString()
  valueEn?: string;

  @ApiProperty({
    example: 'باستخدام خدمتنا، فإنك توافق على...',
    description: 'Setting value in Arabic',
    required: false,
  })
  @IsOptional()
  @IsString()
  valueAr?: string;

  @ApiProperty({
    example: 'Terms of Use content',
    description: 'Description of this setting',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    enum: SettingType,
    example: SettingType.HTML,
    description: 'Type of the setting value',
    required: false,
  })
  @IsOptional()
  @IsEnum(SettingType)
  type?: SettingType;
}
