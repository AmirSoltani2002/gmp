import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './config';
import { AuthGuard, GlobalGuard, RolesGuard, RolesGuardNot, EnhancedRolesGuard } from './auth.guard';
import { PersonModule } from 'src/person/person.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, AuthGuard, GlobalGuard, RolesGuardNot, EnhancedRolesGuard],
  exports: [GlobalGuard, AuthGuard, RolesGuard, RolesGuardNot, EnhancedRolesGuard],
  imports: [PersonModule,
            JwtModule.register({
              global: true,
              secret: jwtConstants.secret,
              signOptions: { expiresIn: '12h' },
            })
  ],
})
export class AuthModule {}
