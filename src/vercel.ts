import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getFirebaseConfig } from './config/firebase.config';
import * as admin from 'firebase-admin';

let cachedServer: any;

async function bootstrapExpressApp() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Initialize Firebase Admin SDK once per cold start
  const firebaseConfig = getFirebaseConfig(configService);
  if (firebaseConfig && !admin.apps.length) {
    admin.initializeApp(firebaseConfig);
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger configuration (served at /api/docs)
  const config = new DocumentBuilder()
    .setTitle('Zawaj-In API')
    .setDescription(
      'Zawaj-In matrimonial platform API with user registration and email OTP verification',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User registration and email verification')
    .addTag('Health', 'Application health checks')
    .addTag('Notifications', 'Push notification services')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Zawaj-In API Documentation',
  });

  // Do not call listen() in serverless
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrapExpressApp();
  }
  return cachedServer(req, res);
}


