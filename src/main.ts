import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
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
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((err: any) => ({
            field: err.property,
            errors: Object.values(err?.constraints || {}),
          })),
        );
      },
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
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
