"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const subscription_plans_seed_1 = require("./subscription-plans.seed");
const super_admin_seed_1 = require("./super-admin.seed");
const users_seed_1 = require("./users.seed");
const matching_preferences_seed_1 = require("./matching-preferences.seed");
const likes_seed_1 = require("./likes.seed");
const conversations_seed_1 = require("./conversations.seed");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
const sslEnabled = configService.get('DB_SSL', 'false') === 'true';
const AppDataSource = new typeorm_1.DataSource({
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
        console.log('1️⃣ Seeding super admin user...');
        await (0, super_admin_seed_1.seedSuperAdmin)(AppDataSource, configService);
        console.log('\n2️⃣ Seeding subscription plans...');
        await (0, subscription_plans_seed_1.seedSubscriptionPlans)(AppDataSource);
        console.log('\n3️⃣ Seeding test users...');
        const users = await (0, users_seed_1.seedUsers)(AppDataSource);
        console.log('\n4️⃣ Seeding matching preferences...');
        await (0, matching_preferences_seed_1.seedMatchingPreferences)(AppDataSource, users);
        console.log('\n5️⃣ Seeding likes and matches...');
        await (0, likes_seed_1.seedLikes)(AppDataSource, users);
        console.log('\n6️⃣ Seeding conversations and messages...');
        await (0, conversations_seed_1.seedConversations)(AppDataSource, users);
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
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
}
runSeeds();
//# sourceMappingURL=seed.js.map