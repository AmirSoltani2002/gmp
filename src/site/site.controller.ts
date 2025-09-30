import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP])
  create(@Body() createSiteDto: CreateSiteDto, @Request() req) {
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
  
    if(req['user'].role !== ROLES.SYSTEM && createSiteDto.companyId != currentCompany)
      throw new BadRequestException('The QRP User cannot Edit this Site');
  
    return this.siteService.create(createSiteDto);
  }

  @Get()
  findAll() {
    return this.siteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(+id);
  }

  @Patch(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async update(@Param('id') id: string, @Body() UpdateSiteDto: UpdateSiteDto, @Request() req) {
    const thisSite = await this.siteService.findOne(+id);
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
  
    if(req['user'].role !== ROLES.SYSTEM && thisSite.companyId != currentCompany)
      throw new BadRequestException('The QRP User cannot Edit this Site');
  
    return this.siteService.update(+id, UpdateSiteDto);
  }
  

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async remove(@Param('id') id: string, @Request() req) {
    const thisSite = await this.siteService.findOne(+id);
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
  
    if(req['user'].role !== ROLES.SYSTEM && thisSite.companyId != currentCompany)
      throw new BadRequestException('The QRP User cannot delete this Site');
  
    return this.siteService.remove(+id);
  }
}
