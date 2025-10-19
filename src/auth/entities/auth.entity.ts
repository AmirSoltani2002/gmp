import { ApiProperty } from '@nestjs/swagger';

/**
 * Auth entity representing authentication-related data
 * This entity is mainly used for Swagger documentation
 * as authentication is handled through JWT tokens
 */
export class Auth {
  @ApiProperty({
    description: 'Authentication session identifier',
    example: 'session_123456789',
  })
  sessionId?: string;

  @ApiProperty({
    description: 'User ID associated with this auth session',
    example: 1,
  })
  userId?: number;

  @ApiProperty({
    description: 'Authentication timestamp',
    example: '2024-10-19T12:00:00Z',
  })
  authenticatedAt?: Date;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: '2024-10-20T12:00:00Z',
  })
  expiresAt?: Date;
}
