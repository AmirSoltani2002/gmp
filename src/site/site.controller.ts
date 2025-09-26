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
    if(req['user'].role === ROLES.QRP && createSiteDto.companyId != req['user'].currentCompanyId)
      throw new BadRequestException('The QRP User cannot Edit this Site');
    return this.siteService.create(createSiteDto);
  }

  @Get()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP])
  findAll() {
    return this.siteService.findAll();
  }

  @Get(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(+id);
  }

  @Patch(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async update(@Param('id') id: string, @Body() UpdateSiteDto: UpdateSiteDto, @Request() req) {
    const thisSite = await this.siteService.findOne(+id);
    if([ROLES.QRP, ROLES.IFDAUSER].includes(req['user'].role) && thisSite.companyId != req['user'].currentCompanyId)
      throw new BadRequestException('The QRP User cannot Edit this Site');
    return this.siteService.update(+id, UpdateSiteDto);
  }

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async remove(@Param('id') id: string, @Request() req) {
    const thisSite = await this.siteService.findOne(+id);
    if([ROLES.QRP, ROLES.IFDAUSER].includes(req['user'].role) && thisSite.companyId != req['user'].currentCompanyId)
      throw new BadRequestException('The QRP User cannot delete this Site');
    return this.siteService.remove(+id);
  }
}
