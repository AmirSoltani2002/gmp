import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Roles, RolesNot } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  create(@Body() CreateSiteDto: CreateSiteDto) {
    return this.siteService.create(CreateSiteDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get()
  findAll() {
    return this.siteService.findAll();
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(+id);
  }

  @RolesNot([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() UpdateSiteDto: UpdateSiteDto, @Request() req) {
    const thisSite = await this.siteService.findOne(+id);
    if(req['user'].role === ROLES.QRP && thisSite.companyId != req['user'].currentCompanyId)
      throw new BadRequestException('The QRP User cannot Edit this Site');
    return this.siteService.update(+id, UpdateSiteDto);
  }

  @RolesNot([ROLES.SYSTEM])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteService.remove(+id);
  }
}
