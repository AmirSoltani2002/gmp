import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter, NotFoundException } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('🔥 Prisma Error caught:', exception); // Debug log
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let httpException;

    if (exception instanceof PrismaClientKnownRequestError) {
      // Handle known request errors
      switch (exception.code) {
        case 'P2002':
          const target = exception.meta?.target;
          const constraintFields = Array.isArray(target) ? target.join(', ') : target || 'unknown field';
          httpException = new ConflictException(`Unique Constraint Violation on field(s): ${constraintFields}`);
          break;
        case 'P2025':
          httpException = new NotFoundException('Record not found ' + exception.meta?.target);
          break;
        default:
          httpException = new BadRequestException('Database error');
      }
    } else if (exception instanceof PrismaClientValidationError) {
      httpException = new BadRequestException('Validation Error');
    } else {
      httpException = new BadRequestException('Unknown Prisma Error');
    }

    response.status(httpException.getStatus()).json({
      statusCode: httpException.getStatus(),
      message: httpException.message,
      timestamp: new Date().toISOString(),
    });
  }
}
