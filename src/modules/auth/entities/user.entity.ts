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

  // Profile fields
  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'int', nullable: true })
  @Index('idx_users_age')
  age: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Location object with city and country',
  })
  location: { city: string; country: string };

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'religious_practice' })
  @Index('idx_users_religious_practice')
  religiousPractice: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sect: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'prayer_level' })
  prayerLevel: string;

  @Column({
    type: 'enum',
    enum: ['single', 'divorced', 'widowed'],
    nullable: true,
    name: 'marital_status',
  })
  @Index('idx_users_marital_status')
  maritalStatus: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profession: string;

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