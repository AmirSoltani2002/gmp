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

  @Get()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  findAll() {
    return this.siteService.findAll();
  }

  @Get(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(+id);
  }

  @Patch(':id')
  @RolesNot([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  async update(@Param('id') id: string, @Body() UpdateSiteDto: UpdateSiteDto, @Request() req) {
    const thisSite = await this.siteService.findOne(+id);
    if(req['user'].role === ROLES.QRP && thisSite.companyId != req['user'].currentCompanyId)
      throw new BadRequestException('The QRP User cannot Edit this Site');
    return this.siteService.update(+id, UpdateSiteDto);
  }

  @Delete(':id')
  @RolesNot([ROLES.SYSTEM])
  remove(@Param('id') id: string) {
    return this.siteService.remove(+id);
  }
}
