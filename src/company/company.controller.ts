import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ROLES } from 'src/common/interface';
import { Roles, RolesNot } from 'src/auth/roles.decorator';
import { PersonService } from 'src/person/person.service';
import { FindAllCompanyDto } from './dto/find-all-company.dto';
import { AccessControlUtils } from 'src/common/access-control.utils';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService,
              private readonly personService: PersonService,
  ) {}


  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companyService.create(createCompanyDto);
    return company
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  @Get()
  findAll(@Query() query: FindAllCompanyDto) {
    return this.companyService.findAll(query);
  }

  @Get('profile')
  findOneByUser(@Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    return this.companyService.findOneByUser(userId);
  }

  @Get('profile/person')
  findOneUsersMy(@Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    return this.companyService.findOneUsers(userId);
  }

  @Get('profile/site')
  findOneSitesMy(@Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    return this.companyService.findOneSitesByUser(userId);
  }

  
  
  @Get('person/:id')
  async findOneUsers(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, id);
    if (access.canAccess) {
      return this.companyService.findOneUsers(+id);
    } else {
      throw new BadRequestException(access.message || "Access denied")
    }
    
  }


  
  @Get('site/:id')
  async findOneSites(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, id);
    if (access.canAccess) {
      return this.companyService.findOneSites(+id);
    } else {
      throw new BadRequestException(access.message || "Access denied")
    }
  }


  
  @Get('machine/:id')
  async findOneMachines(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, id);
    if (access.canAccess) {
      return this.companyService.findOneMachines(+id);
    } else {
      throw new BadRequestException(access.message || "Access denied")
    }
    
  }


  
  @Get('drug/:id')
  async findOneDrugs(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, id);
    if (access.canAccess) {
      return this.companyService.findOneDrugs(+id);
    } else {
      throw new BadRequestException(access.message || "Access denied")
    }
    
  }


  @Get('requests/:id')
  async findOneRequest126(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessRequest(user, id);
    if (access.canAccess) {
      return this.companyService.findOneRequest126s(id);
    } else {
      throw new BadRequestException(access.message || "Access denied")
    }
    
  }


  @Get('id/:id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, id);
    if (access.canAccess) {
      return this.companyService.findOne(+id); 
    } else {
      throw new BadRequestException(access.message || "Access denied")
    }
  }

  @Get('eudra/:code')
  async getEUDRA(@Param('code') code: string) {
    const url = `https://eudragmdp.ema.europa.eu/inspections/gmpc/searchGMPCompliance.do?ctrl=searchGMPCResultControlList&action=Drilldown&param=${code}`
    const resp = await(await fetch(url, {
      method: "GET",
    })).text();
    return {
      url,
      resp
    }
  }

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Patch('profile')
  updateOneByUser(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
    const userId = AccessControlUtils.validateUserId(req);
    return this.companyService.updateOneByUser(userId, updateCompanyDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, id);
    if (access.canAccess) {
      return this.companyService.update(+id, updateCompanyDto);
    } else {
      throw new BadRequestException(access.message || "Access denied")
    }
  }

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, id);
    if (access.canAccess) {
      return this.companyService.remove(+id);
    } else {
      throw new BadRequestException(access.message || "Access denied")
    }
  }
}
