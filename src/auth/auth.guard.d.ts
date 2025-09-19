import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    constructor(jwtService: JwtService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
export declare class RolesGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
export declare class RolesGuardNot implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
export declare class GlobalGuard implements CanActivate {
    private readonly authGuard;
    private readonly rolesGuard;
    private readonly rolesGuardNot;
    constructor(authGuard: AuthGuard, rolesGuard: RolesGuard, rolesGuardNot: RolesGuardNot);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
