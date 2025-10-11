import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getFirebaseConfig } from './config/firebase.config';
import * as admin from 'firebase-admin';
import { ExpressAdapter } from '@nestjs/platform-express';
const express = require('express');

let cachedApp: any;

async function createNestApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  const configService = app.get(ConfigService);

  // Initialize Firebase Admin SDK
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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Zawaj-In API')
    .setDescription('Zawaj-In matrimonial platform API with user registration and email OTP verification')
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
    .addTag('Matching', 'Match recommendations and preferences')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Zawaj-In API Documentation',
  });

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  const app = await createNestApp();
  return app(req, res);
}

// Local development bootstrap
async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  const configService = app.get(ConfigService);

  // Set PostgreSQL timezone to UTC
  const { DataSource } = require('typeorm');
  const dataSource = app.get(DataSource);
  await dataSource.query("SET timezone = 'UTC'");
  console.log('✅ Database timezone set to UTC');

  // Initialize Firebase Admin SDK
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

  // Serve static files for uploads
  const path = require('path');
  const serveStatic = express.static(path.join(__dirname, '..', 'uploads'), {
    setHeaders: (res, filePath) => {
      // Set correct MIME type for audio files
      if (filePath.endsWith('.webm')) {
        res.setHeader('Content-Type', 'audio/webm');
      } else if (filePath.endsWith('.mp3')) {
        res.setHeader('Content-Type', 'audio/mpeg');
      } else if (filePath.endsWith('.wav')) {
        res.setHeader('Content-Type', 'audio/wav');
      } else if (filePath.endsWith('.ogg')) {
        res.setHeader('Content-Type', 'audio/ogg');
      }
    },
  });
  app.use('/uploads', serveStatic);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Zawaj-In API')
    .setDescription('Zawaj-In matrimonial platform API with user registration and email OTP verification')
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
    .addTag('Matching', 'Match recommendations and preferences')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Zawaj-In API Documentation',
  });

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

// Only run bootstrap in local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}