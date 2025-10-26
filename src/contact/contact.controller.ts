import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { PersonService } from 'src/person/person.service';
import { AccessControlUtils } from 'src/common/access-control.utils';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService,
              private readonly personService: PersonService) {}

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Post()
  async create(@Body() createContactDto: CreateContactDto, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, createContactDto.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.contactService.create(createContactDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const contact = await this.contactService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, contact.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.contactService.findOne(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto, @Request() req) {
    const contact = await this.contactService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, contact.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.contactService.update(+id, updateContactDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const contact = await this.contactService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, contact.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.contactService.remove(+id);
  }
}
