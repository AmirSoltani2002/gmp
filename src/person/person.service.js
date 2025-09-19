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
exports.PersonService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let PersonService = class PersonService {
    db;
    constructor(db) {
        this.db = db;
    }
    create(createPersonDto) {
        return this.db.person.create({
            data: createPersonDto
        });
    }
    findAll() {
        return this.db.person.findMany({
            include: { currentCompany: true }
        });
    }
    findOne(id) {
        return this.db.person.findUniqueOrThrow({
            where: { id },
            include: { currentCompany: true }
        });
    }
    findOneByUsername(username) {
        return this.db.person.findUniqueOrThrow({
            where: { username },
            include: { currentCompany: true }
        });
    }
    update(id, updatePersonDto) {
        return this.db.person.update({
            where: { id },
            data: updatePersonDto
        });
    }
    remove(id) {
        return this.db.person.delete({
            where: { id }
        });
    }
    removeByUsername(username) {
        return this.db.person.delete({
            where: { username }
        });
    }
};
exports.PersonService = PersonService;
exports.PersonService = PersonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PersonService);
//# sourceMappingURL=person.service.js.map