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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonController = void 0;
const common_1 = require("@nestjs/common");
const person_service_1 = require("./person.service");
const create_person_dto_1 = require("./dto/create-person.dto");
const update_person_dto_1 = require("./dto/update-person.dto");
const roles_decorator_1 = require("../auth/roles.decorator");
const interface_1 = require("../common/interface");
let PersonController = class PersonController {
    personService;
    constructor(personService) {
        this.personService = personService;
    }
    create(createPersonDto) {
        return this.personService.create(createPersonDto);
    }
    findAll() {
        return this.personService.findAll();
    }
    findOne(id) {
        return this.personService.findOne(+id);
    }
    findOneByUserName(username) {
        return this.personService.findOneByUsername(username);
    }
    findOneByProfile(req) {
        return this.personService.findOne(+req['user'].id);
    }
    updateOne(req, updatePersonDto) {
        return this.personService.update(+req['user'].id, updatePersonDto);
    }
    update(id, updatePersonDto) {
        return this.personService.update(+id, updatePersonDto);
    }
    removeByUsername(username) {
        return this.personService.removeByUsername(username);
    }
    remove(id) {
        return this.personService.remove(+id);
    }
};
exports.PersonController = PersonController;
__decorate([
    (0, roles_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_person_dto_1.CreatePersonDto]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)([interface_1.ROLES.SYSTEM, interface_1.ROLES.IFDAUSER, interface_1.ROLES.IFDAMANAGER]),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)([interface_1.ROLES.SYSTEM, interface_1.ROLES.IFDAUSER, interface_1.ROLES.IFDAMANAGER]),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)([interface_1.ROLES.SYSTEM, interface_1.ROLES.IFDAUSER, interface_1.ROLES.IFDAMANAGER]),
    (0, common_1.Get)('username/:username'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "findOneByUserName", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "findOneByProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_person_dto_1.UpdatePersonDto]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "updateOne", null);
__decorate([
    (0, roles_decorator_1.RolesNot)([interface_1.ROLES.IFDAUSER, interface_1.ROLES.COMPANYOTHER]),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_person_dto_1.UpdatePersonDto]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.RolesNot)([interface_1.ROLES.IFDAUSER, interface_1.ROLES.COMPANYOTHER]),
    (0, common_1.Delete)('username/:username'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "removeByUsername", null);
__decorate([
    (0, roles_decorator_1.RolesNot)([interface_1.ROLES.IFDAUSER, interface_1.ROLES.COMPANYOTHER]),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonController.prototype, "remove", null);
exports.PersonController = PersonController = __decorate([
    (0, common_1.Controller)('person'),
    __metadata("design:paramtypes", [person_service_1.PersonService])
], PersonController);
//# sourceMappingURL=person.controller.js.map