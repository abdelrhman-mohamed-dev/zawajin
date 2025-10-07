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

@Entity('admin_notifications')
@Index('idx_admin_notifications_recipient', ['recipientId'])
export class AdminNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'recipient_id' })
  recipientId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @Column({ type: 'uuid', name: 'sender_id' })
  senderId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: ['email', 'push', 'internal'],
    name: 'notification_type',
  })
  notificationType: string;

  @Column({
    type: 'enum',
    enum: ['sent', 'delivered', 'failed'],
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true, name: 'sent_at' })
  sentAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
