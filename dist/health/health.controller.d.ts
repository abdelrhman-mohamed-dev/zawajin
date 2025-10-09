import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
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
