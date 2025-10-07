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

@Entity('admin_actions')
@Index('idx_admin_actions_admin', ['adminId'])
@Index('idx_admin_actions_created', ['createdAt'])
export class AdminAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'admin_id' })
  adminId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column({
    type: 'enum',
    enum: [
      'ban_user',
      'unban_user',
      'delete_user',
      'edit_user',
      'verify_user',
      'resolve_report',
      'edit_subscription',
      'create_admin',
      'promote_admin',
      'demote_admin',
      'remove_admin',
    ],
    name: 'action_type',
  })
  actionType: string;

  @Column({ type: 'uuid', nullable: true, name: 'target_user_id' })
  targetUserId: string;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'target_user_id' })
  targetUser: User;

  @Column({ type: 'uuid', nullable: true, name: 'target_id' })
  targetId: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Details of the action taken',
  })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
