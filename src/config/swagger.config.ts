import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Standard NestJS Swagger Configuration
 * Provides comprehensive API documentation with enhanced UI settings
 */
export class SwaggerConfig {
  /**
   * Main Swagger document configuration
   */
  static createDocumentConfig() {
    return new DocumentBuilder()
      .setTitle('GMP Backend API')
      .setVersion('1.0.0')
      .addServer('/api', 'API Server')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'JWT Authorization using the Bearer scheme. Example: Authorization: Bearer <token>',
          in: 'header',
        },
        'bearer-key'
      )
      .build();
  }

  /**
   * Enhanced Swagger UI setup options
   */
  static getSwaggerUIOptions() {
    return {
      swaggerOptions: {
        deepLinking: true,
        persistAuthorization: true,
        displayOperationId: false,
        tryItOutEnabled: true,
        defaultModelsExpandDepth: -1,
        defaultModelExpandDepth: 2,
        docExpansion: 'none',
        filter: true,
        displayRequestDuration: true,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
        supportedSubmitMethods: ['get', 'post', 'patch', 'delete'],
      },
      customSiteTitle: 'GMP Backend API Documentation',
    };
  }

  /**
   * Method to setup Swagger with all configurations
   */
  static setup(app: INestApplication, path: string = 'api-docs') {
    const config = this.createDocumentConfig();
    const document = SwaggerModule.createDocument(app, config);
    
    SwaggerModule.setup(path, app, document, this.getSwaggerUIOptions());
    
    console.log(`📚 Swagger documentation available at: /${path}`);
    
    return document;
  }
}