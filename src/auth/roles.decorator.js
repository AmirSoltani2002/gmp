"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.RolesNot = exports.Roles = void 0;
const core_1 = require("@nestjs/core");
exports.Roles = core_1.Reflector.createDecorator();
exports.RolesNot = core_1.Reflector.createDecorator();
exports.Public = core_1.Reflector.createDecorator();
//# sourceMappingURL=roles.decorator.js.map