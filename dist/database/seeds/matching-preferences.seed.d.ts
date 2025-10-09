import { DataSource } from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';
export declare function seedMatchingPreferences(dataSource: DataSource, users: User[]): Promise<void>;
