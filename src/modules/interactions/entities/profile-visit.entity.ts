import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('profile_visits')
@Index('idx_profile_visits_visitor_id', ['visitorId'])
@Index('idx_profile_visits_profile_owner_id', ['profileOwnerId'])
@Index('idx_profile_visits_created_at', ['createdAt'])
@Index('idx_profile_visits_composite', ['profileOwnerId', 'visitorId', 'createdAt'])
export class ProfileVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'visitor_id' })
  visitorId: string;

  @Column({ type: 'uuid', name: 'profile_owner_id' })
  profileOwnerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'visitor_id' })
  visitor: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'profile_owner_id' })
  profileOwner: User;

  @Column({ type: 'boolean', default: false })
  seen: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
