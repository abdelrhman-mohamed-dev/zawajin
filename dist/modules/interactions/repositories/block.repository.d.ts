import { Repository } from 'typeorm';
import { Block } from '../entities/block.entity';
export declare class BlockRepository {
    private readonly blockRepo;
    constructor(blockRepo: Repository<Block>);
    create(blockerId: string, blockedId: string, reason?: string): Promise<Block>;
    findByBlockerAndBlocked(blockerId: string, blockedId: string): Promise<Block | null>;
    delete(blockerId: string, blockedId: string): Promise<void>;
    findBlocksByUser(blockerId: string): Promise<Block[]>;
    isBlocked(blockerId: string, blockedId: string): Promise<boolean>;
    isBlockedByEither(userId1: string, userId2: string): Promise<boolean>;
    countBlocks(blockerId: string): Promise<number>;
}
