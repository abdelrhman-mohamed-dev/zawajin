import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';

@Entity('users')
@Index('idx_users_email', ['email'])
@Index('idx_users_chart_number', ['chartNumber'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'chart_number' })
  chartNumber: string;

  @Column({ type: 'boolean', default: false, name: 'is_email_verified' })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_phone_verified' })
  isPhoneVerified: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'fcm_token' })
  fcmToken: string;

  // Profile fields - Section 1: Basic Info
  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ type: 'int', nullable: true })
  @Index('idx_users_age')
  age: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Location object with city and country',
  })
  location: { city: string; country: string };

  @Column({ type: 'varchar', length: 100, nullable: true })
  origin: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'place_of_residence' })
  placeOfResidence: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tribe: string;

  @Column({
    type: 'enum',
    enum: ['single', 'divorced', 'widowed', 'married', 'virgin', 'widow'],
    nullable: true,
    name: 'marital_status',
  })
  @Index('idx_users_marital_status')
  maritalStatus: string;

  @Column({ type: 'int', nullable: true, name: 'number_of_children' })
  numberOfChildren: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profession: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'education_level' })
  educationLevel: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'financial_status' })
  financialStatus: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'health_status' })
  healthStatus: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'religiosity_level' })
  religiosityLevel: string;

  // Profile fields - Section 2: Physical Attributes
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'skin_color' })
  skinColor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  beauty: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'body_color' })
  bodyColor: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'hair_color' })
  hairColor: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'hair_type' })
  hairType: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'eye_color' })
  eyeColor: string;

  @Column({ type: 'boolean', nullable: true, name: 'house_available' })
  houseAvailable: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'nature_of_work' })
  natureOfWork: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  // Profile fields - Section 3: Partner Preferences
  @Column({ type: 'int', nullable: true, name: 'preferred_age_from' })
  preferredAgeFrom: number;

  @Column({ type: 'int', nullable: true, name: 'preferred_age_to' })
  preferredAgeTo: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_min_weight' })
  preferredMinWeight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_max_weight' })
  preferredMaxWeight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_min_height' })
  preferredMinHeight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'preferred_max_height' })
  preferredMaxHeight: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'preferred_nationality' })
  preferredNationality: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'preferred_residence_place' })
  preferredResidencePlace: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'preferred_education_level' })
  preferredEducationLevel: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'preferred_work_nature' })
  preferredWorkNature: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'preferred_marital_status' })
  preferredMaritalStatus: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'preferred_financial_status' })
  preferredFinancialStatus: string;

  @Column({ type: 'boolean', nullable: true, name: 'preferred_has_house' })
  preferredHasHouse: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'preferred_health_status' })
  preferredHealthStatus: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'preferred_beauty' })
  preferredBeauty: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'preferred_skin_color' })
  preferredSkinColor: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'preferred_religiosity_level' })
  preferredReligiosityLevel: string;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'preferred_accept_polygamy' })
  preferredAcceptPolygamy: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'preferred_marriage_type' })
  preferredMarriageType: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Array of preferred body colors',
  })
  preferredBodyColors: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Array of preferred hair colors',
  })
  preferredHairColors: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Array of preferred eye colors',
  })
  preferredEyeColors: string[];

  @Column({ type: 'text', nullable: true, name: 'partner_preferences_bio' })
  partnerPreferencesBio: string;

  // Profile fields - Section 4: Marriage Preferences
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'marriage_type' })
  marriageType: string;

  @Column({ type: 'boolean', nullable: true, name: 'accept_polygamy' })
  acceptPolygamy: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'polygamy_status' })
  polygamyStatus: string;

  @Column({ type: 'text', nullable: true, name: 'detailed_profile' })
  detailedProfile: string;

  // Legacy fields
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'religious_practice' })
  @Index('idx_users_religious_practice')
  religiousPractice: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sect: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'prayer_level' })
  prayerLevel: string;

  // Admin fields
  @Column({
    type: 'enum',
    enum: ['user', 'admin', 'super_admin'],
    default: 'user',
  })
  @Index('idx_users_role')
  role: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Array of permission strings for granular admin access control',
  })
  permissions: string[];

  @Column({ type: 'boolean', default: false, name: 'is_banned' })
  isBanned: boolean;

  @Column({
    type: 'enum',
    enum: ['temporary', 'permanent'],
    nullable: true,
    name: 'ban_type',
  })
  banType: string;

  @Column({ type: 'timestamp', nullable: true, name: 'banned_at' })
  bannedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'banned_until' })
  bannedUntil: Date;

  @Column({ type: 'text', nullable: true, name: 'banned_reason' })
  bannedReason: string;

  @Column({ type: 'uuid', nullable: true, name: 'banned_by' })
  bannedBy: string;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'verified_at' })
  verifiedAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'verified_by' })
  verifiedBy: string;

  @Column({ type: 'boolean', default: false, name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'role_assigned_by' })
  roleAssignedBy: string;

  @Column({ type: 'timestamp', nullable: true, name: 'role_assigned_at' })
  roleAssignedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  generateChartNumber(): void {
    if (!this.chartNumber) {
      // Generate 2 random characters
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randomChars = chars.charAt(Math.floor(Math.random() * chars.length)) + 
                         chars.charAt(Math.floor(Math.random() * chars.length));
      
      // Generate random 6-digit number
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      
      this.chartNumber = `${randomChars}-${randomDigits}`;
    }
  }
}