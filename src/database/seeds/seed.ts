import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { seedSubscriptionPlans } from './subscription-plans.seed';
import { seedSuperAdmin } from './super-admin.seed';

// Load environment variables
config();

const configService = new ConfigService();

const sslEnabled = configService.get('DB_SSL', 'false') === 'true';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: parseInt(configService.get('DB_PORT', '5432'), 10),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_NAME', 'zawaj_in'),
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});

async function runSeeds() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    console.log('\n🌱 Starting database seeding...\n');

    // Run super admin seed first
    console.log('1️⃣ Seeding super admin user...');
    await seedSuperAdmin(AppDataSource, configService);

    // Run subscription plans seed
    console.log('\n2️⃣ Seeding subscription plans...');
    await seedSubscriptionPlans(AppDataSource);

    console.log('\n✅ All seeds completed successfully!\n');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

runSeeds();
