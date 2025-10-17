import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserPresence } from '../entities/user-presence.entity';

@Injectable()
export class UserPresenceRepository extends Repository<UserPresence> {
  constructor(private dataSource: DataSource) {
    super(UserPresence, dataSource.createEntityManager());
  }

  async setUserOnline(userId: string, socketId: string): Promise<UserPresence> {
    const presence = await this.findOne({ where: { userId } });

    if (presence) {
      presence.isOnline = true;
      presence.socketId = socketId;
      presence.lastSeenAt = new Date();
      return this.save(presence);
    }

    return this.save({
      userId,
      socketId,
      isOnline: true,
      lastSeenAt: new Date(),
    });
  }

  async setUserOffline(userId: string): Promise<void> {
    await this.update(
      { userId },
      {
        isOnline: false,
        socketId: null,
        lastSeenAt: new Date(),
      },
    );
  }

  async getUserPresence(userId: string): Promise<UserPresence | null> {
    return this.findOne({ where: { userId } });
  }

  async findBySocketId(socketId: string): Promise<UserPresence | null> {
    return this.findOne({ where: { socketId } });
  }

  async setUserStatus(userId: string, isOnline: boolean): Promise<UserPresence> {
    const presence = await this.findOne({ where: { userId } });

    if (presence) {
      presence.isOnline = isOnline;
      presence.lastSeenAt = new Date();
      if (!isOnline) {
        presence.socketId = null;
      }
      return this.save(presence);
    }

    return this.save({
      userId,
      isOnline,
      lastSeenAt: new Date(),
      socketId: null,
    });
  }
}
