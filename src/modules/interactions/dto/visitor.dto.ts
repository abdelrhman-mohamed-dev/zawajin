import { ApiProperty } from '@nestjs/swagger';

export class VisitorDto {
  @ApiProperty({
    description: 'Visitor user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

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

  @ApiProperty({
    description: 'Whether the profile owner has seen this visit',
    example: false,
  })
  seen: boolean;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'Gender', enum: ['male', 'female'] })
  gender: string;

  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @ApiProperty({ description: 'Email verification status' })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'Phone verification status' })
  isPhoneVerified: boolean;

  @ApiProperty({ description: 'Account active status' })
  isActive: boolean;

  @ApiProperty({ description: 'Terms acceptance status' })
  termsAccepted: boolean;

  @ApiProperty({ description: 'Date of birth', required: false })
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Age', required: false })
  age?: number;

  @ApiProperty({ description: 'Location with city and country', required: false })
  location?: { city: string; country: string };

  @ApiProperty({ description: 'Origin', required: false })
  origin?: string;

  @ApiProperty({ description: 'Username', required: false })
  username?: string;

  @ApiProperty({ description: 'Nationality', required: false })
  nationality?: string;

  @ApiProperty({ description: 'Place of residence', required: false })
  placeOfResidence?: string;

  @ApiProperty({ description: 'Tribe', required: false })
  tribe?: string;

  @ApiProperty({
    description: 'Marital status',
    enum: ['single', 'divorced', 'widowed', 'married', 'virgin', 'widow'],
    required: false
  })
  maritalStatus?: string;

  @ApiProperty({ description: 'Number of children', required: false })
  numberOfChildren?: number;

  @ApiProperty({ description: 'Profession', required: false })
  profession?: string;

  @ApiProperty({ description: 'Education level', required: false })
  educationLevel?: string;

  @ApiProperty({ description: 'Financial status', required: false })
  financialStatus?: string;

  @ApiProperty({ description: 'Health status', required: false })
  healthStatus?: string;

  @ApiProperty({ description: 'Religiosity level', required: false })
  religiosityLevel?: string;

  @ApiProperty({ description: 'Weight', required: false })
  weight?: number;

  @ApiProperty({ description: 'Height', required: false })
  height?: number;

  @ApiProperty({ description: 'Skin color', required: false })
  skinColor?: string;

  @ApiProperty({ description: 'Beauty', required: false })
  beauty?: string;

  @ApiProperty({ description: 'Body color', required: false })
  bodyColor?: string;

  @ApiProperty({ description: 'Hair color', required: false })
  hairColor?: string;

  @ApiProperty({ description: 'Hair type', required: false })
  hairType?: string;

  @ApiProperty({ description: 'Eye color', required: false })
  eyeColor?: string;

  @ApiProperty({ description: 'House availability', required: false })
  houseAvailable?: boolean;

  @ApiProperty({ description: 'Nature of work', required: false })
  natureOfWork?: string;

  @ApiProperty({ description: 'Bio', required: false })
  bio?: string;

  @ApiProperty({ description: 'Preferred age from', required: false })
  preferredAgeFrom?: number;

  @ApiProperty({ description: 'Preferred age to', required: false })
  preferredAgeTo?: number;

  @ApiProperty({ description: 'Preferred minimum weight', required: false })
  preferredMinWeight?: number;

  @ApiProperty({ description: 'Preferred maximum weight', required: false })
  preferredMaxWeight?: number;

  @ApiProperty({ description: 'Preferred minimum height', required: false })
  preferredMinHeight?: number;

  @ApiProperty({ description: 'Preferred maximum height', required: false })
  preferredMaxHeight?: number;

  @ApiProperty({ description: 'Preferred nationality', required: false })
  preferredNationality?: string;

  @ApiProperty({ description: 'Preferred residence place', required: false })
  preferredResidencePlace?: string;

  @ApiProperty({ description: 'Preferred education level', required: false })
  preferredEducationLevel?: string;

  @ApiProperty({ description: 'Preferred work nature', required: false })
  preferredWorkNature?: string;

  @ApiProperty({ description: 'Preferred marital status', required: false })
  preferredMaritalStatus?: string;

  @ApiProperty({ description: 'Preferred financial status', required: false })
  preferredFinancialStatus?: string;

  @ApiProperty({ description: 'Preferred has house', required: false })
  preferredHasHouse?: boolean;

  @ApiProperty({ description: 'Preferred health status', required: false })
  preferredHealthStatus?: string;

  @ApiProperty({ description: 'Preferred beauty', required: false })
  preferredBeauty?: string;

  @ApiProperty({ description: 'Preferred skin color', required: false })
  preferredSkinColor?: string;

  @ApiProperty({ description: 'Preferred religiosity level', required: false })
  preferredReligiosityLevel?: string;

  @ApiProperty({ description: 'Preferred accept polygamy', required: false })
  preferredAcceptPolygamy?: string;

  @ApiProperty({ description: 'Preferred marriage type', required: false })
  preferredMarriageType?: string;

  @ApiProperty({ description: 'Preferred body colors', type: [String], required: false })
  preferredBodyColors?: string[];

  @ApiProperty({ description: 'Preferred hair colors', type: [String], required: false })
  preferredHairColors?: string[];

  @ApiProperty({ description: 'Preferred eye colors', type: [String], required: false })
  preferredEyeColors?: string[];

  @ApiProperty({ description: 'Partner preferences bio', required: false })
  partnerPreferencesBio?: string;

  @ApiProperty({ description: 'Marriage type', required: false })
  marriageType?: string;

  @ApiProperty({ description: 'Accept polygamy', enum: ['yes', 'no', 'thinking'], required: false })
  acceptPolygamy?: string;

  @ApiProperty({ description: 'Polygamy status', required: false })
  polygamyStatus?: string;

  @ApiProperty({ description: 'Detailed profile', required: false })
  detailedProfile?: string;

  @ApiProperty({ description: 'Religious practice', required: false })
  religiousPractice?: string;

  @ApiProperty({ description: 'Sect', required: false })
  sect?: string;

  @ApiProperty({ description: 'Prayer level', required: false })
  prayerLevel?: string;

  @ApiProperty({ description: 'User role', enum: ['user', 'admin', 'super_admin'] })
  role: string;

  @ApiProperty({ description: 'Is verified user' })
  isVerified: boolean;

  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Account last update date' })
  updatedAt: Date;
}
