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
  private async isUserForThisCompany(req: any, companyId: number | string): Promise<boolean> {
    const userId = this.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const userCompanyId = user.companies?.[0]?.company?.id
    return (user.role === ROLES.SYSTEM || userCompanyId.toString() === companyId.toString())
    
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companyService.create(createCompanyDto);
    return company
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP])
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

  
  @Get('contact/:id')
  async findOneContact(@Param('id') id: string, @Request() req) {
    if(await this.isUserForThisCompany(req, id)) {
      return this.companyService.findOneContact(+id);
    } else {
      throw new UnauthorizedException("This is not your company!")
    }
    
  }


  
  @Get('person/:id')
  async findOneUsers(@Param('id') id: string, @Request() req) {
    if(await this.isUserForThisCompany(req, id)) {
      return this.companyService.findOneUsers(+id);
    } else {
      throw new UnauthorizedException("This is not your company!")
    }
    
  }


  
  @Get('site/:id')
  async findOneSites(@Param('id') id: string, @Request() req) {
    if(await this.isUserForThisCompany(req, id)) {
      return this.companyService.findOneSites(+id);
    } else {
      throw new UnauthorizedException("This is not your company!")
    }
    
  }


  
  @Get('machine/:id')
  async findOneMachines(@Param('id') id: string, @Request() req) {
    if(await this.isUserForThisCompany(req, id)) {
      return this.companyService.findOneMachines(+id);
    } else {
      throw new UnauthorizedException("This is not your company!")
    }
    
  }


  
  @Get('drug/:id')
  async findOneDrugs(@Param('id') id: string, @Request() req) {
    if(await this.isUserForThisCompany(req, id)) {
      return this.companyService.findOneDrugs(+id);
    } else {
      throw new UnauthorizedException("This is not your company!")
    }
    
  }


  @Get('requests/:id')
  @Get('request126s/:id')
  async findOneRequest126(@Param('id') id: string, @Request() req) {
    if(await this.isUserForThisCompany(req, id)) {
      return this.companyService.findOneRequest126s(id);
    } else {
      throw new UnauthorizedException("This is not your company!")
    }
    
  }


  @Get('id/:id')
  async findOne(@Param('id') id: string, @Request() req) {
    if(await this.isUserForThisCompany(req, id)) {
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
