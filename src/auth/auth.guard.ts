import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./config";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { Public, Roles, RolesNot } from 'src/auth/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const publicDec = this.reflector.getAllAndOverride(Public, [
        context.getHandler(),
        context.getClass(),
    ])
    if(publicDec)
        return true
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload; // ✅ attach payload to request
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // no role restriction
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role); // check if user's role matches
  }
}

@Injectable()
export class RolesGuardNot implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(RolesNot, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // no role restriction
    }

    const { user } = context.switchToHttp().getRequest();
    return !requiredRoles.includes(user?.role); // check if user's role matches
  }
}

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly rolesGuard: RolesGuard,
    private readonly rolesGuardNot: RolesGuardNot,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Run AuthGuard first
    const authResult = await this.authGuard.canActivate(context);
    if (!authResult) return false;

    // Then run RolesGuard
    return this.rolesGuard.canActivate(context) && this.rolesGuardNot.canActivate(context);
  }
}

