import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Public, Roles, RolesNot } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { PasswordService } from 'src/auth/config';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  //@Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Public()
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

  @Get(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  async findOne(@Param('id') id: string) {
    const {passwordHash, ...rest} = await this.personService.findOne(+id);
    return rest;
  }

  @Get('username/:username')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  async findOneByUserName(@Param('username') username: string) {
    const {passwordHash, ...rest} = await this.personService.findOneByUsername(username);
    return rest;
  }

  @Get('profile')
  async findOneByProfile(@Request() req) {
    const {passwordHash, ...rest} = await this.personService.findOne(+req['user'].id);
    return rest;
  }

  @Patch('profile')
  async updateOne(@Request() req, @Body() updatePersonDto: UpdatePersonDto) {
    if(updatePersonDto.passwordHash)
      updatePersonDto.passwordHash = await PasswordService.hashPassword(updatePersonDto.passwordHash)
    const {passwordHash, ...rest} = await this.personService.update(+req['user'].id, updatePersonDto);
    return rest;
  }

  @Patch(':id')
  @RolesNot([ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto, @Request() req) {
    const thisUser = await this.personService.findOne(+id);
    if(req['user'].role === ROLES.QRP && thisUser.currentCompanyId != req['user'].currentCompanyId)
          throw new BadRequestException('The QRP User cannot Edit this Site');
    if(updatePersonDto.passwordHash)
      updatePersonDto.passwordHash = await PasswordService.hashPassword(updatePersonDto.passwordHash)
    const {passwordHash, ...rest} = await this.personService.update(+id, updatePersonDto);
    return rest;
  }

  @Delete('username/:username')
  @RolesNot([ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  asynremoveByUsername(@Param('username') username: string) {
    return this.personService.removeByUsername(username);
  }

  @Delete(':id')
  @RolesNot([ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
