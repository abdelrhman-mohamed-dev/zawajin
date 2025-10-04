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

@Entity('likes')
@Unique(['userId', 'likedUserId'])
@Index('idx_likes_user_id', ['userId'])
@Index('idx_likes_liked_user_id', ['likedUserId'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'liked_user_id' })
  likedUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'liked_user_id' })
  likedUser: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
