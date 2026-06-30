import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Security headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    }),
  );

  // CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger documentation (non-production)
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('IASA API')
      .setDescription(
        '**Intelligent API Security Assessment** — Automated API security testing and vulnerability detection platform.\n\n' +
        'This API provides endpoints for managing projects, running security assessments, and viewing findings.',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .addApiKey({ type: 'apiKey', in: 'header', name: 'X-API-Key' }, 'ApiKey')
      .addTag('Auth', 'Authentication and authorization')
      .addTag('Projects', 'Project management')
      .addTag('API Specs', 'OpenAPI specification management')
      .addTag('Assessments', 'Security assessment management')
      .addTag('Findings', 'Vulnerability findings')
      .addTag('Reports', 'Report generation and download')
      .addTag('Users', 'User management')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    });
  }

  await app.listen(port);

  console.log(`
  ╔══════════════════════════════════════════════════════╗
  ║                                                      ║
  ║   IASA — Intelligent API Security Assessment         ║
  ║   Version 0.1.0                                      ║
  ║                                                      ║
  ║   API:  http://localhost:${port}/api/v1                ║
  ║   Docs: http://localhost:${port}/api/docs              ║
  ║   Env:  ${nodeEnv.padEnd(42)}║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
  `);
}

bootstrap();
