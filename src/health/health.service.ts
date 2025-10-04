import { Injectable, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as admin from 'firebase-admin';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async checkHealth() {
    const timestamp = new Date().toISOString();
    const dbStatus = await this.checkDatabase();
    const redisStatus = await this.checkRedis();
    const firebaseStatus = await this.checkFirebase();

    return {
      status: 'ok',
      timestamp,
      services: {
        database: dbStatus,
        redis: redisStatus,
        firebase: firebaseStatus,
      },
    };
  }

  async checkDatabase() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'healthy',
        message: 'Database connection is working',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        error: error.message,
      };
    }
  }

  async checkRedis() {
    try {
      const testKey = 'health_check_test';
      const testValue = 'test_value';

      await this.cacheManager.set(testKey, testValue, 1000);
      const retrievedValue = await this.cacheManager.get(testKey);

      if (retrievedValue === testValue) {
        await this.cacheManager.del(testKey);
        return {
          status: 'healthy',
          message: 'Redis connection is working',
        };
      } else {
        return {
          status: 'unhealthy',
          message: 'Redis connection test failed',
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Redis connection failed',
        error: error.message,
      };
    }
  }

  async checkFirebase() {
    try {
      if (admin.apps.length === 0) {
        return {
          status: 'not_configured',
          message: 'Firebase is not configured',
        };
      }

      const app = admin.app();
      if (app) {
        return {
          status: 'healthy',
          message: 'Firebase is initialized and ready',
        };
      } else {
        return {
          status: 'unhealthy',
          message: 'Firebase app not found',
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Firebase check failed',
        error: error.message,
      };
    }
  }
}