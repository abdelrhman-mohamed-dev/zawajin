"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const firebase_config_1 = require("./config/firebase.config");
const admin = require("firebase-admin");
const platform_express_1 = require("@nestjs/platform-express");
const express = require('express');
let cachedApp;
async function createNestApp() {
    if (cachedApp) {
        return cachedApp;
    }
    const expressApp = express();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
    const configService = app.get(config_1.ConfigService);
    const firebaseConfig = (0, firebase_config_1.getFirebaseConfig)(configService);
    if (firebaseConfig && !admin.apps.length) {
        admin.initializeApp(firebaseConfig);
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Zawaj-In API')
        .setDescription('Zawaj-In matrimonial platform API with user registration and email OTP verification')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Authentication', 'User registration and email verification')
        .addTag('Health', 'Application health checks')
        .addTag('Notifications', 'Push notification services')
        .addTag('Matching', 'Match recommendations and preferences')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'Zawaj-In API Documentation',
    });
    await app.init();
    cachedApp = expressApp;
    return expressApp;
}
async function handler(req, res) {
    const app = await createNestApp();
    return app(req, res);
}
async function bootstrap() {
    const expressApp = express();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
    const configService = app.get(config_1.ConfigService);
    const firebaseConfig = (0, firebase_config_1.getFirebaseConfig)(configService);
    if (firebaseConfig && !admin.apps.length) {
        admin.initializeApp(firebaseConfig);
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Zawaj-In API')
        .setDescription('Zawaj-In matrimonial platform API with user registration and email OTP verification')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Authentication', 'User registration and email verification')
        .addTag('Health', 'Application health checks')
        .addTag('Notifications', 'Push notification services')
        .addTag('Matching', 'Match recommendations and preferences')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'Zawaj-In API Documentation',
    });
    const port = configService.get('PORT', 3001);
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
if (process.env.NODE_ENV !== 'production') {
    bootstrap();
}
//# sourceMappingURL=main.js.map