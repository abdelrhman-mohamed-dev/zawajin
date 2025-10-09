import { DataSource } from 'typeorm';
import { Cache } from 'cache-manager';
export declare class HealthService {
    private dataSource;
    private cacheManager;
    constructor(dataSource: DataSource, cacheManager: Cache);
    checkHealth(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: {
                status: string;
                message: string;
                error?: undefined;
            } | {
                status: string;
                message: string;
                error: any;
            };
            redis: {
                status: string;
                message: string;
                error?: undefined;
            } | {
                status: string;
                message: string;
                error: any;
            };
            firebase: {
                status: string;
                message: string;
                error?: undefined;
            } | {
                status: string;
                message: string;
                error: any;
            };
        };
    }>;
    checkDatabase(): Promise<{
        status: string;
        message: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
    }>;
    checkRedis(): Promise<{
        status: string;
        message: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
    }>;
    checkFirebase(): Promise<{
        status: string;
        message: string;
        error?: undefined;
    } | {
        status: string;
        message: string;
        error: any;
    }>;
}
