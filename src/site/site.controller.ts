import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { PersonService } from 'src/person/person.service';
import { AccessControlUtils } from 'src/common/access-control.utils';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService,
              private readonly personService: PersonService) {}


  @Post()
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async create(@Body() createSiteDto: CreateSiteDto, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessSite(user, createSiteDto.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
  
    return this.siteService.create(createSiteDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  @Get()
  findAll() {
    return this.siteService.findAll();
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const site = await this.siteService.findOne(+id);
    const access = await AccessControlUtils.canAccessSite(user, site.companyId);
    if (access.canAccess) {
      return this.siteService.findOne(+id);
    } else {
      throw new BadRequestException(access.message || "Access denied");
    }
  }

  @Patch(':id')
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async update(@Param('id') id: string, @Body() UpdateSiteDto: UpdateSiteDto, @Request() req) {
    const thisSite = await this.siteService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessSite(user, thisSite.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
  
    return this.siteService.update(+id, UpdateSiteDto);
  }
  

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async remove(@Param('id') id: string, @Request() req) {
    const thisSite = await this.siteService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessSite(user, thisSite.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
  
    return this.siteService.remove(+id);
  }
}
