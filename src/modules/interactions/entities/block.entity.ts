import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('blocks')
@Unique(['blockerId', 'blockedId'])
@Index('idx_blocks_blocker_id', ['blockerId'])
@Index('idx_blocks_blocked_id', ['blockedId'])
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'blocker_id' })
  blockerId: string;

  @Column({ type: 'uuid', name: 'blocked_id' })
  blockedId: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blocker_id' })
  blocker: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blocked_id' })
  blocked: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
