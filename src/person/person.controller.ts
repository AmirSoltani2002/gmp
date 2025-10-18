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

  private validateUserId(req: any): number {
    const userId = req['user']?.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    
    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      throw new BadRequestException('Invalid user ID format');
    }
    
    return userIdNumber;
  }

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

  @Get('profile')
  async findOneByProfile(@Request() req) {
    const userId = this.validateUserId(req);
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
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  async findOne(@Param('id') id: string) {
    const idNumber = parseInt(id, 10);
    
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    
    const {passwordHash, ...rest} = await this.personService.findOne(idNumber);
    return rest;
  }

  @Patch('profile')
  async updateOne(@Request() req, @Body() updatePersonDto: UpdatePersonDto) {
    const userId = this.validateUserId(req);
    
    if(updatePersonDto.passwordHash)
      updatePersonDto.passwordHash = await PasswordService.hashPassword(updatePersonDto.passwordHash)
    const {passwordHash, ...rest} = await this.personService.update(userId, updatePersonDto);
    return rest;
  }

  @Patch(':id')
  @RolesNot([ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto, @Request() req) {
    if(updatePersonDto.passwordHash)
      updatePersonDto.passwordHash = await PasswordService.hashPassword(updatePersonDto.passwordHash)
    const {passwordHash, ...rest} = await this.personService.update(+id, updatePersonDto);
    return rest;
  }

  @Delete(':id')
  @RolesNot([ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
