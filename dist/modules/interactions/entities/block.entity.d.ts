import { User } from '../../auth/entities/user.entity';
export declare class Block {
    id: string;
    blockerId: string;
    blockedId: string;
    reason: string;
    blocker: User;
    blocked: User;
    createdAt: Date;
}
