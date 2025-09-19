"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaExceptionFilter = class PrismaExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let httpException;
        switch (exception.code) {
            case 'P2000':
                httpException = new common_1.BadRequestException('Too Long Value');
                break;
            case 'P2002':
                httpException = new common_1.ConflictException('Unique Constraint');
                break;
            case 'P2003':
                httpException = new common_1.BadRequestException('FoeignKey Exception');
                break;
            case 'P2004':
                httpException = new common_1.BadRequestException('Constraint Violation');
                break;
            case 'P2005':
            case 'P2006':
            case 'P2007':
                httpException = new common_1.BadRequestException('Invalid Value Exception');
                break;
            case 'P2025':
                httpException = new common_1.NotFoundException();
                break;
        }
        response.status(httpException.getStatus()).json({
            statusCode: httpException.getStatus(),
            message: httpException.message,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map