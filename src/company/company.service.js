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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let CompanyService = class CompanyService {
    db;
    constructor(db) {
        this.db = db;
    }
    create(createCompanyDto) {
        return this.db.company.create({
            data: createCompanyDto
        });
    }
    findAll() {
        return this.db.company.findMany();
    }
    findOne(id) {
        return this.db.company.findUniqueOrThrow({
            where: { id },
        });
    }
    findOneUsers(id) {
        return this.db.company.findUniqueOrThrow({
            where: { id },
            include: { persons: true }
        });
    }
    findOneContact(id) {
        return this.db.company.findUniqueOrThrow({
            where: { id },
            include: { contacts: true }
        });
    }
    findOneByUser(id) {
        return this.db.company.findFirstOrThrow({
            where: {
                persons: {
                    some: {
                        id
                    }
                }
            }
        });
    }
    updateOneByUser(id, updateCompanyDto) {
        return this.db.company.updateMany({
            where: {
                persons: {
                    some: {
                        id: id
                    }
                }
            },
            data: updateCompanyDto
        });
    }
    update(id, updateCompanyDto) {
        return this.db.company.update({
            where: { id },
            data: updateCompanyDto
        });
    }
    remove(id) {
        return this.db.company.delete({
            where: { id }
        });
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], CompanyService);
//# sourceMappingURL=company.service.js.map