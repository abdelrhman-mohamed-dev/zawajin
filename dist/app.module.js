"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const core_1 = require("@nestjs/core");
const nestjs_i18n_1 = require("nestjs-i18n");
const path = require("path");
const database_config_1 = require("./config/database.config");
const redis_config_1 = require("./config/redis.config");
const health_module_1 = require("./health/health.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const auth_module_1 = require("./modules/auth/auth.module");
const mail_module_1 = require("./modules/mail/mail.module");
const users_module_1 = require("./modules/users/users.module");
const interactions_module_1 = require("./modules/interactions/interactions.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const seed_module_1 = require("./database/seeds/seed.module");
const chat_module_1 = require("./modules/chat/chat.module");
const admin_module_1 = require("./modules/admin/admin.module");
const matching_module_1 = require("./modules/matching/matching.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: database_config_1.getDatabaseConfig,
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                inject: [config_1.ConfigService],
                useFactory: redis_config_1.getRedisConfig,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ([
                    {
                        ttl: configService.get('RATE_LIMIT_TTL', 60000),
                        limit: configService.get('RATE_LIMIT_DEFAULT', 100),
                    },
                ]),
                inject: [config_1.ConfigService],
            }),
            nestjs_i18n_1.I18nModule.forRoot({
                fallbackLanguage: 'en',
                loaderOptions: {
                    path: path.join(__dirname, '/i18n/'),
                    watch: true,
                },
                resolvers: [
                    { use: nestjs_i18n_1.QueryResolver, options: ['lang'] },
                    nestjs_i18n_1.AcceptLanguageResolver,
                ],
            }),
            schedule_1.ScheduleModule.forRoot(),
            health_module_1.HealthModule,
            notifications_module_1.NotificationsModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            users_module_1.UsersModule,
            interactions_module_1.InteractionsModule,
            subscriptions_module_1.SubscriptionsModule,
            seed_module_1.SeedModule,
            chat_module_1.ChatModule,
            admin_module_1.AdminModule,
            matching_module_1.MatchingModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map