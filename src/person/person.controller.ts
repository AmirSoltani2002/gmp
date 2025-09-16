import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Roles, RolesNot } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personService.findOne(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get('username/:username')
  findOneByUserName(@Param('id') username: string) {
    return this.personService.findOneByUsername(username);
  }

  @Get('profile')
  findOneByProfile(@Request() req) {
    return this.personService.findOne(+req['user'].id);
  }

  @Patch('profile')
  updateOne(@Request() req, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+req['user'].id, updatePersonDto);
  }

  @RolesNot([ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @RolesNot([ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  @Delete('username/:username')
  removeByUsername(@Param('id') username: string) {
    return this.personService.removeByUsername(username);
  }

  @RolesNot([ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
