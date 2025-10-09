import { User } from '../../auth/entities/user.entity';
export declare class AdminAction {
    id: string;
    adminId: string;
    admin: User;
    actionType: string;
    targetUserId: string;
    targetUser: User;
    targetId: string;
    reason: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
