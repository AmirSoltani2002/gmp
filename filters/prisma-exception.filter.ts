import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let httpException;

    // ✅ Handle Prisma P2025 (Record not found)
    switch (exception.code) {
        case 'P2000':
            httpException = new BadRequestException('Too Long Value');
            break;
        case 'P2002':
            httpException = new ConflictException('Unique Constraint');
            break;
        case 'P2003':
            httpException = new BadRequestException('FoeignKey Exception');
            break;
        case 'P2004':
            httpException = new BadRequestException('Constraint Violation');
            break;
        case 'P2005':
        case 'P2006':
        case 'P2007':
            httpException = new BadRequestException('Invalid Value Exception');
            break;
        case 'P2025':
            httpException = new NotFoundException();
            break;
        
    }
    response.status(httpException.getStatus()).json({
      statusCode: httpException.getStatus(),
      message: httpException.message,
      timestamp: new Date().toISOString(),
    });
  }
}
