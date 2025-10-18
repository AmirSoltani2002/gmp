import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ROLES } from 'src/common/interface';
import { Roles, RolesNot } from 'src/auth/roles.decorator';
import { PersonService } from 'src/person/person.service';
import { FindAllCompanyDto } from './dto/find-all-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService,
              private readonly personService: PersonService,
  ) {}

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

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companyService.create(createCompanyDto);
    return company
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get()
  findAll(@Query() query: FindAllCompanyDto) {
    return this.companyService.findAll(query);
  }

  @Get('profile')
  findOneByUser(@Request() req) {
    const userId = this.validateUserId(req);
    return this.companyService.findOneByUser(userId);
  }

  @Get('profile/contact')
  findOneContactMy(@Request() req) {
    const userId = this.validateUserId(req);
    return this.companyService.findOneContact(userId);
  }

  @Get('profile/person')
  findOneUsersMy(@Request() req) {
    const userId = this.validateUserId(req);
    return this.companyService.findOneUsers(userId);
  }

  @Get('profile/site')
  findOneSitesMy(@Request() req) {
    const userId = this.validateUserId(req);
    return this.companyService.findOneSitesByUser(userId);
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

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get('machine/:id')
  findOneCompany(@Param('id') id: string) {
    return this.companyService.findOneMachines(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get('drug/:id')
  findOneDrug(@Param('id') id: string) {
    return this.companyService.findOneDrugs(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get('request126/:id')
  findOneRequest126(@Param('id') id: string) {
    return this.companyService.findOneRequest126s(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = this.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const userCompanyId = user.companies?.[0]?.company?.id
    if(user.role === ROLES.SYSTEM || userCompanyId.toString() === id) {
      return this.companyService.findOne(+id);
    } else {
      throw new UnauthorizedException("This is not your company!")
    }
    
  }

  @RolesNot([ROLES.COMPANYOTHER, ROLES.IFDAUSER])
  @Patch('profile')
  updateOneByUser(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    const userId = this.validateUserId(req);
    return this.companyService.updateOneByUser(userId, updateCompanyDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Roles([ROLES.SYSTEM])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
