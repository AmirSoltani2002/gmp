"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalGuard = exports.RolesGuardNot = exports.RolesGuard = exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("./config");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("./roles.decorator");
let AuthGuard = class AuthGuard {
    jwtService;
    reflector;
    constructor(jwtService, reflector) {
        this.jwtService = jwtService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const publicDec = this.reflector.getAllAndOverride(roles_decorator_1.Public, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (publicDec)
            return true;
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('Missing token');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: config_1.jwtConstants.secret,
            });
            request['user'] = payload;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, core_1.Reflector])
], AuthGuard);
let RolesGuard = class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.Roles, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user?.role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
let RolesGuardNot = class RolesGuardNot {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.RolesNot, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return !requiredRoles.includes(user?.role);
    }
};
exports.RolesGuardNot = RolesGuardNot;
exports.RolesGuardNot = RolesGuardNot = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuardNot);
let GlobalGuard = class GlobalGuard {
    authGuard;
    rolesGuard;
    rolesGuardNot;
    constructor(authGuard, rolesGuard, rolesGuardNot) {
        this.authGuard = authGuard;
        this.rolesGuard = rolesGuard;
        this.rolesGuardNot = rolesGuardNot;
    }
    async canActivate(context) {
        const authResult = await this.authGuard.canActivate(context);
        if (!authResult)
            return false;
        return this.rolesGuard.canActivate(context) && this.rolesGuardNot.canActivate(context);
    }
};
exports.GlobalGuard = GlobalGuard;
exports.GlobalGuard = GlobalGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [AuthGuard,
        RolesGuard,
        RolesGuardNot])
], GlobalGuard);
//# sourceMappingURL=auth.guard.js.map