import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
config();

/**
 * Script to update all numeric values in the database to integers
 * This removes the .00 decimal places from all numeric fields including:
 * - age, numberOfChildren, preferredAgeFrom, preferredAgeTo
 * - weight, height, preferredMinWeight, preferredMaxWeight, preferredMinHeight, preferredMaxHeight
 */
async function updateWeightHeightToIntegers() {
  // Create database connection
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'zawajin',
    synchronize: false,
  });

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database');

    // Read SQL file
    const sqlPath = join(__dirname, 'update-numeric-fields-to-integers.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    console.log('📝 Executing SQL updates...');

    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.toLowerCase().includes('select')) {
        // For SELECT statements, show the results
        const result = await dataSource.query(statement);
        console.log('📊 Verification results:', result);
      } else {
        // For UPDATE statements, execute and show affected rows
        const result = await dataSource.query(statement);
        if (result && result.length !== undefined) {
          console.log(`✅ Updated ${result.length} rows`);
        }
      }
    }

    console.log('✅ All numeric fields have been updated to integers!');
  } catch (error) {
    console.error('❌ Error updating database:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the update
updateWeightHeightToIntegers()
  .then(() => {
    console.log('✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
