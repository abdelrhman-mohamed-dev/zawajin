import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { seedSubscriptionPlans } from './subscription-plans.seed';
import { seedSuperAdmin } from './super-admin.seed';
import { seedUsers } from './users.seed';
import { seedMatchingPreferences } from './matching-preferences.seed';
import { seedLikes } from './likes.seed';
import { seedConversations } from './conversations.seed';

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

    // Run users seed
    console.log('\n3️⃣ Seeding test users...');
    const users = await seedUsers(AppDataSource);

    // Run matching preferences seed
    console.log('\n4️⃣ Seeding matching preferences...');
    await seedMatchingPreferences(AppDataSource, users);

    // Run likes seed
    console.log('\n5️⃣ Seeding likes and matches...');
    await seedLikes(AppDataSource, users);

    // Run conversations seed
    console.log('\n6️⃣ Seeding conversations and messages...');
    await seedConversations(AppDataSource, users);

    console.log('\n✅ All seeds completed successfully!\n');
    console.log('📝 Summary:');
    console.log('   - 1 Super Admin');
    console.log('   - 4 Subscription Plans');
    console.log(`   - ${users.length} Test Users`);
    console.log('   - Matching Preferences for active users');
    console.log('   - Mutual likes creating matches');
    console.log('   - Conversations with sample messages');
    console.log('\n🔑 Default password for test users: Test@123\n');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

runSeeds();
