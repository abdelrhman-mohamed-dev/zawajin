import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Transform } from 'class-transformer';

@Entity('subscription_plans')
@Index(['isActive', 'displayOrder'])
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => value ? parseFloat(value) : value)
  priceMonthly: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => value ? parseFloat(value) : value)
  priceYearly: number;

  @Column({ type: 'jsonb' })
  features: string[];

  @Column({ type: 'int', nullable: true })
  maxLikesPerDay: number | null; // null = unlimited

  @Column({ type: 'boolean', default: false })
  canSendMessages: boolean;

  @Column({ type: 'boolean', default: false })
  canViewLikes: boolean;

  @Column({ type: 'boolean', default: false })
  canSeeWhoLikedYou: boolean;

  @Column({ type: 'boolean', default: false })
  prioritySupport: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profileBadge: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
