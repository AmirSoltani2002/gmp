import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra properties
      forbidNonWhitelisted: true, // throw error for unknown fields
      transform: true, // transform payloads to DTO instances
      transformOptions: { enableImplicitConversion: true },
      
    }),
  );
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true, // allow cookies or auth headers
  });
  const config = new DocumentBuilder()
    .setTitle('UserInfo APIs')
    .setDescription('Backend service API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new PrismaExceptionFilter());
  const port = Number(process.env.PORT) || 8000;
  const host = process.env.HOST ?? '0.0.0.0'; // or '127.0.0.1'
  await app.listen(port, host);
}
bootstrap();
