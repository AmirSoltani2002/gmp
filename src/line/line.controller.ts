import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { LineService } from './line.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { SiteService } from 'src/site/site.service';

@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService, 
              private readonly siteService: SiteService) {}
  @Post()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP])
  async create(@Body() createLineDto: CreateLineDto, @Request() req) {
    const site = await this.siteService.findOne(+createLineDto.siteId);
    const companyId = site.companyId;
  
    // get current company of the user
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
  
    if(req['user'].role !== ROLES.SYSTEM && companyId != currentCompany)
          throw new BadRequestException('The QRP User cannot Edit this Site');
  
    return this.lineService.create(createLineDto);
  }

  @Get()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.COMPANYOTHER])
  findAll() {
    return this.lineService.findAll();
  }

  @Get(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.COMPANYOTHER])
  findOne(@Param('id') id: string) {
    return this.lineService.findOne(+id);
  }

  @Patch(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto, @Request() req) {
    const thisLine = await this.lineService.findOne(+id);
  
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
  
    if(req['user'].role !== ROLES.SYSTEM && thisLine.site.companyId != currentCompany)
      throw new BadRequestException('The QRP User cannot Edit this Site');
  
    return this.lineService.update(+id, updateLineDto);
  }

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async remove(@Param('id') id: string, @Request() req) {
    const line = await this.lineService.findOne(+id);
  
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
  
    if(line.site.companyId !== currentCompany && req['user'].role !== ROLES.SYSTEM)
      throw new UnauthorizedException();
  
    return this.lineService.remove(+id);
  }
}
