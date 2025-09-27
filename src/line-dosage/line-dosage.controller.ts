import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException } from '@nestjs/common';
import { LineDosageService } from './line-dosage.service';
import { CreateLineDosageDto } from './dto/create-line-dosage.dto';
import { UpdateLineDosageDto } from './dto/update-line-dosage.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { LineService } from 'src/line/line.service';
import { DosageService } from 'src/dosage/dosage.service';


@Controller('line-dosage')
export class LineDosageController {
  constructor(private readonly lineDosageService: LineDosageService,
              private readonly lineService: LineService,
              private readonly dosageService: DosageService
  ) {}

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP])
  @Post()
  async create(@Body() createLineDosageDto: CreateLineDosageDto, @Request() req) {
    const line = await this.lineService.findOne(createLineDosageDto.lineId);
    if(line.site.companyId !== req['user'].companyId && req['user'].role !== ROLES.SYSTEM)
      throw new UnauthorizedException();
    return this.lineDosageService.create(createLineDosageDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP])
  @Get()
  findAll() {
    return this.lineDosageService.findAll();
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineDosageService.findOne(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLineDosageDto: UpdateLineDosageDto, @Request() req) {
    const lineDosage = await this.lineDosageService.findOne(+id);
    if(lineDosage.line.site.companyId !== req['user'].companyId && req['user'].role !== ROLES.SYSTEM)
      throw new UnauthorizedException();
    return this.lineDosageService.update(+id, updateLineDosageDto);
  }

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async remove(@Param('id') id: string, @Request() req) {
    const lineDosage = await this.lineDosageService.findOne(+id);
    if(lineDosage.line.site.companyId !== req['user'].companyId && req['user'].role !== ROLES.SYSTEM)
      throw new UnauthorizedException();
    return this.lineDosageService.remove(+id);
  }
}
