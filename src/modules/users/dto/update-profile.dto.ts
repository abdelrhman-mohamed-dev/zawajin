import {
  IsString,
  IsInt,
  IsOptional,
  IsObject,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsArray,
  IsDateString,
  Min,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  BodyColor,
  HairColor,
  HairType,
  EyeColor,
  MarriageType,
} from '../../../common/enums/profile.enums';

class LocationDto {
  @ApiProperty({ example: 'Dubai', description: 'City name' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'UAE', description: 'Country name' })
  @IsString()
  @MaxLength(100)
  country: string;
}

export class UpdateProfileDto {
  // Section 1: Basic Info
  @ApiProperty({
    example: '1995-05-15',
    description: 'Date of birth (YYYY-MM-DD format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    example: 30,
    description: 'User age (auto-calculated from dateOfBirth if provided)',
    minimum: 18,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  age?: number;

  @ApiProperty({
    example: { city: 'Dubai', country: 'UAE' },
    description: 'User location',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({
    example: 'Pakistani',
    description: 'Country or region of origin',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  origin?: string;

  @ApiProperty({
    example: 'single',
    description: 'Marital status',
    enum: ['single', 'divorced', 'widowed'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['single', 'divorced', 'widowed'], {
    message: 'Marital status must be one of: single, divorced, widowed',
  })
  maritalStatus?: string;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'Profession/occupation',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  profession?: string;

  // Section 2: Physical Attributes
  @ApiProperty({
    example: 70.5,
    description: 'Weight in kilograms',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  weight?: number;

  @ApiProperty({
    example: 175.5,
    description: 'Height in centimeters',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  height?: number;

  @ApiProperty({
    example: BodyColor.MEDIUM,
    description: 'Skin tone/body color',
    enum: BodyColor,
    required: false,
  })
  @IsOptional()
  @IsEnum(BodyColor)
  bodyColor?: BodyColor;

  @ApiProperty({
    example: HairColor.BLACK,
    description: 'Hair color',
    enum: HairColor,
    required: false,
  })
  @IsOptional()
  @IsEnum(HairColor)
  hairColor?: HairColor;

  @ApiProperty({
    example: HairType.STRAIGHT,
    description: 'Hair type',
    enum: HairType,
    required: false,
  })
  @IsOptional()
  @IsEnum(HairType)
  hairType?: HairType;

  @ApiProperty({
    example: EyeColor.BROWN,
    description: 'Eye color',
    enum: EyeColor,
    required: false,
  })
  @IsOptional()
  @IsEnum(EyeColor)
  eyeColor?: EyeColor;

  @ApiProperty({
    example: true,
    description: 'Whether the user owns a house',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  houseAvailable?: boolean;

  @ApiProperty({
    example: 'Full-time office job',
    description: 'Nature or type of work',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  natureOfWork?: string;

  @ApiProperty({
    example: 'A kind and practicing Muslim looking for a life partner.',
    description: 'User bio/description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  // Section 3: Partner Preferences
  @ApiProperty({
    example: 50,
    description: 'Preferred minimum weight for partner (kg)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  preferredMinWeight?: number;

  @ApiProperty({
    example: 80,
    description: 'Preferred maximum weight for partner (kg)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  preferredMaxWeight?: number;

  @ApiProperty({
    example: 150,
    description: 'Preferred minimum height for partner (cm)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  preferredMinHeight?: number;

  @ApiProperty({
    example: 180,
    description: 'Preferred maximum height for partner (cm)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  preferredMaxHeight?: number;

  @ApiProperty({
    example: [BodyColor.FAIR, BodyColor.MEDIUM],
    description: 'Preferred body colors for partner',
    enum: BodyColor,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(BodyColor, { each: true })
  preferredBodyColors?: BodyColor[];

  @ApiProperty({
    example: [HairColor.BLACK, HairColor.DARK_BROWN],
    description: 'Preferred hair colors for partner',
    enum: HairColor,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(HairColor, { each: true })
  preferredHairColors?: HairColor[];

  @ApiProperty({
    example: [EyeColor.BROWN, EyeColor.HAZEL],
    description: 'Preferred eye colors for partner',
    enum: EyeColor,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(EyeColor, { each: true })
  preferredEyeColors?: EyeColor[];

  @ApiProperty({
    example: 'Looking for someone who is kind, religious, and family-oriented.',
    description: 'Additional preferences or description of ideal partner',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  partnerPreferencesBio?: string;

  // Section 4: Marriage Preferences
  @ApiProperty({
    example: MarriageType.RELIGIOUS,
    description: 'Type of marriage preference',
    enum: MarriageType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MarriageType)
  marriageType?: MarriageType;

  @ApiProperty({
    example: false,
    description: 'Whether the user accepts polygamy',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  acceptPolygamy?: boolean;

  // Legacy fields (backward compatibility)
  @ApiProperty({
    example: 'male',
    description: 'User gender',
    enum: ['male', 'female'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female'], {
    message: 'Gender must be either male or female',
  })
  gender?: string;

  @ApiProperty({
    example: 'Religious',
    description: 'Level of religious practice',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  religiousPractice?: string;

  @ApiProperty({
    example: 'Sunni',
    description: 'Religious sect',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sect?: string;

  @ApiProperty({
    example: 'Prays 5 times a day',
    description: 'Prayer level',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  prayerLevel?: string;
}
