import { User } from '../../auth/entities/user.entity';
export declare class UserPresence {
    userId: string;
    user: User;
    socketId: string;
    isOnline: boolean;
    lastSeenAt: Date;
    updatedAt: Date;
}
