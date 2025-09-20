import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() createContactDto: CreateContactDto, @Request() req) {
    if(req['user'].role !== ROLES.SYSTEM && req['user'].currentCompanyId !== createContactDto.companyId)
      throw new UnauthorizedException();
    return this.contactService.create(createContactDto);
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto, @Request() req) {
    if(req['user'].role !== ROLES.SYSTEM){
      const thisContact = await this.contactService.findOne(+id);
      if(req['user'].currentCompanyId !== thisContact.companyId)
        throw new UnauthorizedException();
    }
    return this.contactService.update(+id, updateContactDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    if(req['user'].role !== ROLES.SYSTEM){
      const thisContact = await this.contactService.findOne(+id);
      if(req['user'].currentCompanyId !== thisContact.companyId)
        throw new UnauthorizedException();
    }
    return this.contactService.remove(+id);
  }
}
