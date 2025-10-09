import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare function seedSuperAdmin(dataSource: DataSource, configService: ConfigService): Promise<void>;
