import { Reflector } from '@nestjs/core';
import { ROLES } from 'src/common/interface';

export const Roles = Reflector.createDecorator<ROLES[]>();
export const RolesNot = Reflector.createDecorator<ROLES[]>();
export const Public = Reflector.createDecorator<boolean>();
