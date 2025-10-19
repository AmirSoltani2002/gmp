import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PersonService } from 'src/person/person.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateAuthDto } from './dto/create-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUpWithUsername: jest.fn(),
    verifyToken: jest.fn(),
    getHealthStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: PersonService,
          useValue: {
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            // Mock database service methods if needed
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate user and return token', async () => {
      const loginDto: CreateAuthDto = {
        username: 'testuser',
        password: 'testpass',
      };
      const expectedResult = { token: 'jwt-token' };

      mockAuthService.signUpWithUsername.mockResolvedValue(expectedResult);

      const result = await controller.signUpWithUsername(loginDto);

      expect(authService.signUpWithUsername).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTokenInfo', () => {
    it('should return user information from token', async () => {
      const mockRequest = {
        user: {
          id: 1,
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'ifdaUser',
          companyId: 1,
          iat: 1698672000,
          exp: 1698758400,
        },
      };

      const result = await controller.getTokenInfo(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      const result = await controller.healthCheck();

      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('service', 'auth-service');
      expect(result).toHaveProperty('version');
    });
  });
});
