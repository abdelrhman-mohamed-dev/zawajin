import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('activity_logs')
@Index('idx_activity_logs_user', ['userId'])
@Index('idx_activity_logs_created', ['createdAt'])
@Index('idx_activity_logs_activity_type', ['activityType'])
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: [
      'login',
      'logout',
      'profile_update',
      'message_sent',
      'like_sent',
      'subscription_created',
      'report_created',
    ],
    name: 'activity_type',
  })
  activityType: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Additional context about the activity',
  })
  metadata: Record<string, any>;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'ip_address' })
  ipAddress: string;

  @Column({ type: 'text', nullable: true, name: 'user_agent' })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
