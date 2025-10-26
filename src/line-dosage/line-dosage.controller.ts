import { Controller, Get, Post, Body, Patch, Param, Delete, Request, BadRequestException } from '@nestjs/common';
import { LineDosageService } from './line-dosage.service';
import { CreateLineDosageDto } from './dto/create-line-dosage.dto';
import { UpdateLineDosageDto } from './dto/update-line-dosage.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { LineService } from 'src/line/line.service';
import { DosageService } from 'src/dosage/dosage.service';
import { PersonService } from 'src/person/person.service';
import { AccessControlUtils } from 'src/common/access-control.utils';


@Controller('line-dosage')
export class LineDosageController {
  constructor(private readonly lineDosageService: LineDosageService,
              private readonly lineService: LineService,
              private readonly dosageService: DosageService,
              private readonly personService: PersonService
  ) {}

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Post()
  async create(@Body() createLineDosageDto: CreateLineDosageDto, @Request() req) {
    const line = await this.lineService.findOne(createLineDosageDto.lineId);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessLine(user, line.site.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.lineDosageService.create(createLineDosageDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  @Get()
  findAll() {
    return this.lineDosageService.findAll();
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const lineDosage = await this.lineDosageService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessLine(user, lineDosage.line.site.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.lineDosageService.findOne(+id);
  }

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLineDosageDto: UpdateLineDosageDto, @Request() req) {
    const lineDosage = await this.lineDosageService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessLine(user, lineDosage.line.site.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.lineDosageService.update(+id, updateLineDosageDto);
  }

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.QRP])
  async remove(@Param('id') id: string, @Request() req) {
    const lineDosage = await this.lineDosageService.findOne(+id);
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessLine(user, lineDosage.line.site.companyId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.lineDosageService.remove(+id);
  }
}
