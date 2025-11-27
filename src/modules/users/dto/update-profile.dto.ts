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
  Tribe,
  MaritalStatus,
  EducationLevel,
  EmploymentType,
  FinancialStatus,
  HealthStatus,
  ReligiosityLevel,
  SkinColor,
  Beauty,
  PolygamyStatus,
  HijabStyle,
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
    example: 'john_doe',
    description: 'Username',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  username?: string;

  @ApiProperty({
    example: 'Saudi',
    description: 'User nationality',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string;

  @ApiProperty({
    example: 'Riyadh',
    description: 'Place of residence',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  placeOfResidence?: string;

  @ApiProperty({
    example: Tribe.TRIBAL,
    description: 'Tribe status',
    enum: Tribe,
    required: false,
  })
  @IsOptional()
  @IsEnum(Tribe)
  tribe?: Tribe;

  @ApiProperty({
    example: MaritalStatus.SINGLE,
    description: 'Marital status (use appropriate value based on gender)',
    enum: MaritalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiProperty({
    example: 0,
    description: 'Number of children',
    minimum: 0,
    maximum: 20,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  numberOfChildren?: number;

  @ApiProperty({
    example: EducationLevel.UNIVERSITY,
    description: 'Educational level',
    enum: EducationLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @ApiProperty({
    example: FinancialStatus.GOOD,
    description: 'Financial status',
    enum: FinancialStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(FinancialStatus)
  financialStatus?: FinancialStatus;

  @ApiProperty({
    example: HealthStatus.HEALTHY,
    description: 'Health status',
    enum: HealthStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(HealthStatus)
  healthStatus?: HealthStatus;

  @ApiProperty({
    example: ReligiosityLevel.COMMITTED,
    description: 'Level of religiosity',
    enum: ReligiosityLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReligiosityLevel)
  religiosityLevel?: ReligiosityLevel;

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
    example: SkinColor.WHITE,
    description: 'Skin color',
    enum: SkinColor,
    required: false,
  })
  @IsOptional()
  @IsEnum(SkinColor)
  skinColor?: SkinColor;

  @ApiProperty({
    example: Beauty.AVERAGE,
    description: 'Beauty/appearance rating (use appropriate values based on gender)',
    enum: Beauty,
    required: false,
  })
  @IsOptional()
  @IsEnum(Beauty)
  beauty?: Beauty;

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
    example: HijabStyle.HIJAB,
    description: 'Hijab style (for female users only)',
    enum: HijabStyle,
    required: false,
  })
  @IsOptional()
  @IsEnum(HijabStyle)
  hijabStyle?: HijabStyle;

  @ApiProperty({
    example: true,
    description: 'Whether the user owns a house',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  houseAvailable?: boolean;

  @ApiProperty({
    example: EmploymentType.EMPLOYED,
    description: 'Nature or type of work',
    enum: EmploymentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  natureOfWork?: EmploymentType;

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
    example: 25,
    description: 'Preferred minimum age for partner',
    minimum: 18,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  preferredAgeFrom?: number;

  @ApiProperty({
    example: 35,
    description: 'Preferred maximum age for partner',
    minimum: 18,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  preferredAgeTo?: number;

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
    example: 'Saudi',
    description: 'Preferred nationality for partner',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredNationality?: string;

  @ApiProperty({
    example: 'Riyadh',
    description: 'Preferred residence place for partner',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  preferredResidencePlace?: string;

  @ApiProperty({
    example: EducationLevel.UNIVERSITY,
    description: 'Preferred education level for partner',
    enum: EducationLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(EducationLevel)
  preferredEducationLevel?: EducationLevel;

  @ApiProperty({
    example: EmploymentType.EMPLOYED,
    description: 'Preferred work nature for partner',
    enum: EmploymentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  preferredWorkNature?: EmploymentType;

  @ApiProperty({
    example: MaritalStatus.SINGLE,
    description: 'Preferred marital status for partner',
    enum: MaritalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  preferredMaritalStatus?: MaritalStatus;

  @ApiProperty({
    example: FinancialStatus.GOOD,
    description: 'Preferred financial status for partner',
    enum: FinancialStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(FinancialStatus)
  preferredFinancialStatus?: FinancialStatus;

  @ApiProperty({
    example: true,
    description: 'Whether partner should have a house',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  preferredHasHouse?: boolean;

  @ApiProperty({
    example: HealthStatus.HEALTHY,
    description: 'Preferred health status for partner',
    enum: HealthStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(HealthStatus)
  preferredHealthStatus?: HealthStatus;

  @ApiProperty({
    example: Beauty.AVERAGE,
    description: 'Preferred beauty/appearance for partner',
    enum: Beauty,
    required: false,
  })
  @IsOptional()
  @IsEnum(Beauty)
  preferredBeauty?: Beauty;

  @ApiProperty({
    example: SkinColor.WHITE,
    description: 'Preferred skin color for partner',
    enum: SkinColor,
    required: false,
  })
  @IsOptional()
  @IsEnum(SkinColor)
  preferredSkinColor?: SkinColor;

  @ApiProperty({
    example: ReligiosityLevel.COMMITTED,
    description: 'Preferred religiosity level for partner',
    enum: ReligiosityLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReligiosityLevel)
  preferredReligiosityLevel?: ReligiosityLevel;

  @ApiProperty({
    example: 'yes',
    description: 'Whether accepts polygamy for partner (males only)',
    enum: ['yes', 'no', 'thinking'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['yes', 'no', 'thinking'], {
    message: 'preferredAcceptPolygamy must be either yes, no, or thinking',
  })
  preferredAcceptPolygamy?: string;

  @ApiProperty({
    example: MarriageType.RELIGIOUS,
    description: 'Preferred marriage type for partner',
    enum: MarriageType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MarriageType)
  preferredMarriageType?: MarriageType;

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
    example: 'yes',
    description: 'Whether the user accepts polygamy',
    enum: ['yes', 'no', 'thinking'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['yes', 'no', 'thinking'], {
    message: 'acceptPolygamy must be either yes, no, or thinking',
  })
  acceptPolygamy?: string;

  @ApiProperty({
    example: PolygamyStatus.NO,
    description: 'Polygamy status (for women) or polygamy intention (for men)',
    enum: PolygamyStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PolygamyStatus)
  polygamyStatus?: PolygamyStatus;

  @ApiProperty({
    example: 'Looking for a serious relationship...',
    description: 'Detailed profile description (no phone numbers or contact info allowed)',
    maxLength: 2000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  detailedProfile?: string;

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
