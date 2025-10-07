import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Conversation } from '../../chat/entities/conversation.entity';

@Entity('user_reports')
@Index('idx_user_reports_reported_user', ['reportedUserId'])
@Index('idx_user_reports_status', ['status'])
@Index('idx_user_reports_priority', ['priority'])
export class UserReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'reporter_id' })
  reporterId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ type: 'uuid', name: 'reported_user_id' })
  reportedUserId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'reported_user_id' })
  reportedUser: User;

  @Column({
    type: 'enum',
    enum: [
      'inappropriate_content',
      'fake_profile',
      'harassment',
      'spam',
      'fraud',
      'other',
    ],
    name: 'report_type',
  })
  reportType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Screenshots, message IDs, and other evidence',
  })
  evidence: Record<string, any>;

  @Column({ type: 'uuid', nullable: true, name: 'conversation_id' })
  conversationId: string;

  @ManyToOne(() => Conversation, { eager: false, nullable: true })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column({
    type: 'enum',
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  })
  priority: string;

  @Column({ type: 'uuid', nullable: true, name: 'reviewed_by' })
  reviewedBy: string;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column({ type: 'timestamp', nullable: true, name: 'reviewed_at' })
  reviewedAt: Date;

  @Column({ type: 'text', nullable: true })
  resolution: string;

  @Column({
    type: 'enum',
    enum: [
      'no_action',
      'warning_sent',
      'user_suspended',
      'user_banned',
      'content_removed',
    ],
    nullable: true,
    name: 'action_taken',
  })
  actionTaken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
