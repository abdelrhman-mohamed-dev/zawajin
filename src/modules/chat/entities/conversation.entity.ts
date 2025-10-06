import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Message } from './message.entity';

@Entity('conversations')
@Unique(['participant1Id', 'participant2Id'])
@Index(['participant1Id'])
@Index(['participant2Id'])
@Index(['lastMessageAt'])
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  participant1Id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'participant1Id' })
  participant1: User;

  @Column({ type: 'uuid' })
  participant2Id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'participant2Id' })
  participant2: User;

  @Column({ type: 'uuid', nullable: true })
  matchId: string; // Reference to the mutual like that enabled this conversation

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  lastMessagePreview: string;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to check if a user is a participant
  isParticipant(userId: string): boolean {
    return this.participant1Id === userId || this.participant2Id === userId;
  }

  // Get the other participant's ID
  getOtherParticipantId(userId: string): string {
    return this.participant1Id === userId
      ? this.participant2Id
      : this.participant1Id;
  }
}
