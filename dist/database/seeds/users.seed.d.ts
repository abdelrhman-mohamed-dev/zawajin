import { DataSource } from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';
export declare function seedUsers(dataSource: DataSource): Promise<User[]>;
