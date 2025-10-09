"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const admin = require("firebase-admin");
let HealthService = class HealthService {
    constructor(dataSource, cacheManager) {
        this.dataSource = dataSource;
        this.cacheManager = cacheManager;
    }
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
        }
        catch (error) {
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
            }
            else {
                return {
                    status: 'unhealthy',
                    message: 'Redis connection test failed',
                };
            }
        }
        catch (error) {
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
            }
            else {
                return {
                    status: 'unhealthy',
                    message: 'Firebase app not found',
                };
            }
        }
        catch (error) {
            return {
                status: 'unhealthy',
                message: 'Firebase check failed',
                error: error.message,
            };
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.DataSource, Object])
], HealthService);
//# sourceMappingURL=health.service.js.map