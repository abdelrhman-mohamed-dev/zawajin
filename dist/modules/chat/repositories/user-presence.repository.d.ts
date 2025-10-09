import { DataSource, Repository } from 'typeorm';
import { UserPresence } from '../entities/user-presence.entity';
export declare class UserPresenceRepository extends Repository<UserPresence> {
    private dataSource;
    constructor(dataSource: DataSource);
    setUserOnline(userId: string, socketId: string): Promise<UserPresence>;
    setUserOffline(userId: string): Promise<void>;
    getUserPresence(userId: string): Promise<UserPresence | null>;
    findBySocketId(socketId: string): Promise<UserPresence | null>;
}
