"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'password'),
    database: configService.get('DB_NAME', 'zawaj_in'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get('DB_SYNCHRONIZE', true),
    logging: configService.get('DB_LOGGING', false),
    ssl: configService.get('DB_SSL', false),
    extra: {
        timezone: 'UTC',
        ssl: configService.get('DB_SSL', false)
            ? { rejectUnauthorized: false }
            : false,
    },
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map