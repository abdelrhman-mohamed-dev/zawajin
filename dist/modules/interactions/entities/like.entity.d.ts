import { User } from '../../auth/entities/user.entity';
export declare class Like {
    id: string;
    userId: string;
    likedUserId: string;
    user: User;
    likedUser: User;
    createdAt: Date;
}
