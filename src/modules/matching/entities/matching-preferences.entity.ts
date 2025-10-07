import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('matching_preferences')
@Index('idx_matching_preferences_user', ['userId'])
export class MatchingPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Age preferences
  @Column({ type: 'int', nullable: true, name: 'min_age' })
  minAge: number;

  @Column({ type: 'int', nullable: true, name: 'max_age' })
  maxAge: number;

  // Location preferences
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'preferred_city' })
  preferredCity: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'preferred_country' })
  preferredCountry: string;

  @Column({
    type: 'int',
    nullable: true,
    name: 'max_distance_km',
    comment: 'Maximum distance in kilometers (for future geo-search)',
  })
  maxDistanceKm: number;

  // Religious preferences
  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'preferred_religious_practices',
    comment: 'Array of accepted religious practice levels',
  })
  preferredReligiousPractices: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'preferred_sects',
    comment: 'Array of accepted sects',
  })
  preferredSects: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'preferred_prayer_levels',
    comment: 'Array of accepted prayer levels',
  })
  preferredPrayerLevels: string[];

  // Marital status preferences
  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'preferred_marital_statuses',
    comment: 'Array of accepted marital statuses',
  })
  preferredMaritalStatuses: string[];

  // Profession preferences
  @Column({
    type: 'jsonb',
    nullable: true,
    name: 'preferred_professions',
    comment: 'Array of preferred professions',
  })
  preferredProfessions: string[];

  // Gender preference (who they're looking for)
  @Column({
    type: 'enum',
    enum: ['male', 'female'],
    nullable: true,
    name: 'looking_for_gender',
  })
  lookingForGender: string;

  // Importance weights (0-10 scale)
  @Column({
    type: 'int',
    default: 5,
    name: 'age_importance',
    comment: 'Importance of age match (0-10)',
  })
  ageImportance: number;

  @Column({
    type: 'int',
    default: 5,
    name: 'location_importance',
    comment: 'Importance of location match (0-10)',
  })
  locationImportance: number;

  @Column({
    type: 'int',
    default: 8,
    name: 'religious_importance',
    comment: 'Importance of religious practice match (0-10)',
  })
  religiousImportance: number;

  @Column({
    type: 'int',
    default: 5,
    name: 'marital_status_importance',
    comment: 'Importance of marital status match (0-10)',
  })
  maritalStatusImportance: number;

  @Column({
    type: 'int',
    default: 3,
    name: 'profession_importance',
    comment: 'Importance of profession match (0-10)',
  })
  professionImportance: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
