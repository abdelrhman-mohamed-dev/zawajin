import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from '../entities/block.entity';

@Injectable()
export class BlockRepository {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepo: Repository<Block>,
  ) {}

  async create(blockerId: string, blockedId: string, reason?: string): Promise<Block> {
    const block = this.blockRepo.create({ blockerId, blockedId, reason });
    return await this.blockRepo.save(block);
  }

  async findByBlockerAndBlocked(blockerId: string, blockedId: string): Promise<Block | null> {
    return await this.blockRepo.findOne({
      where: { blockerId, blockedId },
    });
  }

  async delete(blockerId: string, blockedId: string): Promise<void> {
    await this.blockRepo.delete({ blockerId, blockedId });
  }

  async findBlocksByUser(blockerId: string): Promise<Block[]> {
    return await this.blockRepo.find({
      where: { blockerId },
      relations: ['blocked'],
      order: { createdAt: 'DESC' },
    });
  }

  async isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const block = await this.findByBlockerAndBlocked(blockerId, blockedId);
    return !!block;
  }

  async isBlockedByEither(userId1: string, userId2: string): Promise<boolean> {
    const block1 = await this.isBlocked(userId1, userId2);
    const block2 = await this.isBlocked(userId2, userId1);
    return block1 || block2;
  }

  async countBlocks(blockerId: string): Promise<number> {
    return await this.blockRepo.count({ where: { blockerId } });
  }
}
