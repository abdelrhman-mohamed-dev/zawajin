import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Conversation } from './conversation.entity';

export enum EngagementStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused',
  CANCELLED = 'cancelled',
}

@Entity('engagement_requests')
@Index(['senderId', 'recipientId'])
@Index(['conversationId'])
@Index(['status'])
export class EngagementRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'uuid' })
  recipientId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column({ type: 'uuid' })
  conversationId: string;

  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column({
    type: 'enum',
    enum: EngagementStatus,
    default: EngagementStatus.PENDING,
  })
  status: EngagementStatus;

  @Column({ type: 'text', nullable: true })
  message: string; // Optional message from sender

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date; // When recipient accepted/refused

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
