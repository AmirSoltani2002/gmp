import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LineService } from './line.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { SiteService } from 'src/site/site.service';
import { PersonService } from 'src/person/person.service';
import { AccessControlUtils } from 'src/common/access-control.utils';

@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService, 
              private readonly siteService: SiteService,
              private readonly personService: PersonService) {}

  @Post()
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async create(@Body() createLineDto: CreateLineDto, @Request() req) {
    const site = await this.siteService.findOne(+createLineDto.siteId);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessLine(user, site.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
  
    return this.lineService.create(createLineDto);
  }

  @Get()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  findAll() {
    return this.lineService.findAll();
  }

  @Get('id/:id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const line = await this.lineService.findOne(+id);
    const access = await AccessControlUtils.canAccessLine(user, line.site.companyId);
    if (access.canAccess) {
      return this.lineService.findOne(+id);
    } else {
      throw new BadRequestException(access.message || "Access denied");
    }
  }

  @Patch(':id')
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto, @Request() req) {
    const thisLine = await this.lineService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessLine(user, thisLine.site.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
  
    return this.lineService.update(+id, updateLineDto);
  }

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async remove(@Param('id') id: string, @Request() req) {
    const line = await this.lineService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessLine(user, line.site.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
  
    return this.lineService.remove(+id);
  }
}
