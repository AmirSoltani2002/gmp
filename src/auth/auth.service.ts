import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginResponseDto } from './dto/auth-responses.dto';
import { JwtService } from '@nestjs/jwt';
import { PersonService } from 'src/person/person.service';
import { PasswordService } from './config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService, 
    private readonly personService: PersonService
  ) {}

  async signUpWithUsername(createAuthDto: CreateAuthDto): Promise<LoginResponseDto> {
    try {
      // Find user by username
      const user = await this.personService.findOneByUsername(createAuthDto.username);
      
      // Verify password
      if (!await PasswordService.compare(user.passwordHash, createAuthDto.password)) {
        throw new BadRequestException('Wrong Username or Password');
      }
      
      // Remove sensitive data from user object
      const { passwordHash, ...userPayload } = user;
      
      // Generate JWT token with user information
      const token = await this.jwt.signAsync(userPayload);
      
      return { token };
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes('User not found') || error.code === 'P2025') {
        throw new BadRequestException('Wrong Username or Password');
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Verify and decode JWT token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  async verifyToken(token: string) {
    try {
      return await this.jwt.verifyAsync(token);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  /**
   * Check if auth service is healthy
   * @returns Health status information
   */
  async getHealthStatus() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      version: process.env.npm_package_version || '1.0.0'
    };
  }
}
