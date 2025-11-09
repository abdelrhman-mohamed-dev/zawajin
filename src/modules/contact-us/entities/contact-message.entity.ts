import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum ContactMessageStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum ContactMessagePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum SatisfactionRating {
  VERY_DISSATISFIED = 1,
  DISSATISFIED = 2,
  NEUTRAL = 3,
  SATISFIED = 4,
  VERY_SATISFIED = 5,
}

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: SatisfactionRating,
    nullable: true,
  })
  satisfactionRating: SatisfactionRating;

  @Column({ type: 'int', nullable: true, comment: 'Rating from 1-10' })
  serviceRating: number;

  @Column({
    type: 'enum',
    enum: ContactMessageStatus,
    default: ContactMessageStatus.PENDING,
  })
  status: ContactMessageStatus;

  @Column({
    type: 'enum',
    enum: ContactMessagePriority,
    default: ContactMessagePriority.MEDIUM,
  })
  priority: ContactMessagePriority;

  @Column({ nullable: true })
  assignedToAdminId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToAdminId' })
  assignedToAdmin: User;

  @Column({ type: 'text', nullable: true })
  adminResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
