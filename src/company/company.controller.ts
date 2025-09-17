import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ROLES } from 'src/common/interface';
import { Roles, RolesNot } from 'src/auth/roles.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get('contact/:id')
  findOneContact(@Param('id') id: string) {
    return this.companyService.findOneContact(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get('person/:id')
  findOneUsers(@Param('id') id: string) {
    return this.companyService.findOneUsers(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get('site/:id')
  findOneSites(@Param('id') id: string) {
    return this.companyService.findOneSites(+id);
  }

  @Get('profile')
  findOneByUser(@Request() req) {
    return this.companyService.findOneByUser(+req['user'].id);
  }

  @Get('profile/contact')
  findOneContactMy(@Request() req) {
    return this.companyService.findOneContact(+req['user'].id);
  }

  @Get('profile/person')
  findOneUsersMy(@Request() req) {
    return this.companyService.findOneUsers(+req['user'].id);
  }

  @Get('profile/site')
  findOneSitesMy(@Request() req) {
    return this.companyService.findOneSites(+req['user'].id);
  }

  @RolesNot([ROLES.COMPANYOTHER, ROLES.IFDAUSER])
  @Patch('profile')
  updateOneByUser(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateOneByUser(+req['user'].id, updateCompanyDto);
  }

  @RolesNot([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @RolesNot([ROLES.SYSTEM])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
