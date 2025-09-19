"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const company_module_1 = require("./company/company.module");
const contact_module_1 = require("./contact/contact.module");
const person_module_1 = require("./person/person.module");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("./auth/auth.guard");
const prisma_exception_filter_1 = require("../filters/prisma-exception.filter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [company_module_1.CompanyModule, contact_module_1.ContactModule, person_module_1.PersonModule, database_module_1.DatabaseModule, auth_module_1.AuthModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.GlobalGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: prisma_exception_filter_1.PrismaExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map