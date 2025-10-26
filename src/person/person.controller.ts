import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Public, Roles, RolesNot } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { PasswordService } from 'src/auth/config';
import { AccessControlUtils } from 'src/common/access-control.utils';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}


  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  // @Public()
  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    createPersonDto.passwordHash = await PasswordService.hashPassword(createPersonDto.passwordHash)
    const {passwordHash, ...rest} = await this.personService.create(createPersonDto);
    return rest;
  }

  @Get()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  async findAll() {
    const people = await this.personService.findAll();
    return people.map(({ passwordHash, ...rest }) => rest);
  }

  @Get('profile')
  async findOneByProfile(@Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const {passwordHash, ...rest} = await this.personService.findOne(userId);
    return rest;
  }

  @Get('username/:username')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  async findOneByUserName(@Param('username') username: string) {
    const {passwordHash, ...rest} = await this.personService.findOneByUsername(username);
    return rest;
  }

  @Get('id/:id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  async findOne(@Param('id') id: string, @Request() req) {
    const idNumber = parseInt(id, 10);
    
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    
    const person = await this.personService.findOne(idNumber);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const personCompanyId = person.companies?.[0]?.company?.id;
    
    if (personCompanyId) {
      const access = await AccessControlUtils.canAccessRestrictedEntity(user, personCompanyId, 'person');
      if (!access.canAccess) {
        throw new BadRequestException(access.message || 'Access denied');
      }
    }
    
    const {passwordHash, ...rest} = person;
    return rest;
  }

  @Patch('profile')
  async updateOne(@Request() req, @Body() updatePersonDto: UpdatePersonDto) {
    const userId = AccessControlUtils.validateUserId(req);
    
    if(updatePersonDto.passwordHash)
      updatePersonDto.passwordHash = await PasswordService.hashPassword(updatePersonDto.passwordHash)
    const {passwordHash, ...rest} = await this.personService.update(userId, updatePersonDto);
    return rest;
  }

  @Patch(':id')
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto, @Request() req) {
    const person = await this.personService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const personCompanyId = person.companies?.[0]?.company?.id;
    
    if (personCompanyId) {
      const access = await AccessControlUtils.canAccessRestrictedEntity(user, personCompanyId, 'person');
      if (!access.canAccess) {
        throw new BadRequestException(access.message || 'Access denied');
      }
    }
    
    if(updatePersonDto.passwordHash)
      updatePersonDto.passwordHash = await PasswordService.hashPassword(updatePersonDto.passwordHash)
    const {passwordHash, ...rest} = await this.personService.update(+id, updatePersonDto);
    return rest;
  }

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async remove(@Param('id') id: string, @Request() req) {
    const person = await this.personService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const personCompanyId = person.companies?.[0]?.company?.id;
    
    if (personCompanyId) {
      const access = await AccessControlUtils.canAccessRestrictedEntity(user, personCompanyId, 'person');
      if (!access.canAccess) {
        throw new BadRequestException(access.message || 'Access denied');
      }
    }
    
    return this.personService.remove(+id);
  }
}
