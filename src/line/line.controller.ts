import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from '@nestjs/common';
import { LineService } from './line.service';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'add_rows';

@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}
    
  @Post()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP])
  create(@Body() createLineDto: CreateLineDto, @Request() req) {
    if(req['user'].role === ROLES.QRP && createLineDto.companyId != req['user'].currentCompanyId)
          throw new BadRequestException('The QRP User cannot Edit this Site');
    return this.lineService.create(createLineDto);
  }

  @Get()
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP])
  findAll() {
    return this.lineService.findAll();
  }

  @Get(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  findOne(@Param('id') id: string) {
    return this.lineService.findOne(+id);
  }

  @Patch(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async update(@Param('id') id: string, @Body() updateLineDto: UpdateLineDto) {
    const thisLine = await this.lineService.findOne(+id);
    if([ROLES.QRP, ROLES.IFDAUSER].includes(req['user'].role) && thisLine.siteId != req['user'].currentCompanyId)
      throw new BadRequestException('The QRP User cannot Edit this Site');
    return this.lineService.update(+id, updateLineDto);
  }

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  remove(@Param('id') id: string) {
    return this.lineService.remove(+id);
  }
}
