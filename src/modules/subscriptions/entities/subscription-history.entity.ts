import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { User } from '../../auth/entities/user.entity';
import { Subscription } from './subscription.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

export enum SubscriptionAction {
  CREATED = 'created',
  UPGRADED = 'upgraded',
  DOWNGRADED = 'downgraded',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  RENEWED = 'renewed',
}

@Entity('subscription_history')
@Index(['userId', 'createdAt'])
export class SubscriptionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  subscriptionId: string;

  @ManyToOne(() => Subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'planId' })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionAction,
  })
  action: SubscriptionAction;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Transform(({ value }) => value ? parseFloat(value) : value)
  amount: number;

  @Column({ type: 'varchar', length: 50 })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;
}
