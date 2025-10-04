import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException } from '@nestjs/common';
import { MachineService } from './machine.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { MachineTypeService } from 'src/machine-type/machine-type.service';
import { SiteService } from 'src/site/site.service';
import { LineService } from 'src/line/line.service';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService,
    private readonly machineTypeService: MachineTypeService,
    private readonly siteService: SiteService,
    private readonly lineService: LineService,

  ) {}

  @Post()
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP])
  async create(@Body() createMachineDto: CreateMachineDto, @Request() req) {
    let companyId: number | null = null;
    if(createMachineDto.siteId) {
      const site = await this.siteService.findOne(+createMachineDto.siteId);
      companyId = site.companyId;
    } else if(createMachineDto.lineId) {
      const line = await this.lineService.findOne(+createMachineDto.lineId);
      companyId = line.site.companyId;
    }
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
    if(![ROLES.SYSTEM, ROLES.IFDAMANAGER].includes(req['user'].role) && companyId != currentCompany)
      throw new UnauthorizedException();

    return this.machineService.create(createMachineDto);
  }

  @Get()
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  findAll() {
    return this.machineService.findAll();
  }

  @Get(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER, ROLES.COMPANYOTHER])
  findOne(@Param('id') id: string) {
    return this.machineService.findOne(+id);
  }

  @Patch(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.IFDAUSER])
  async update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto, @Request() req) {
    let companyId: number | null = null;
    if(updateMachineDto.siteId) {
      const site = await this.siteService.findOne(+updateMachineDto.siteId);
      companyId = site.companyId;
    } else if(updateMachineDto.lineId) {
      const line = await this.lineService.findOne(+updateMachineDto.lineId);
      companyId = line.site.companyId;
    }
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
    if(![ROLES.SYSTEM, ROLES.IFDAMANAGER].includes(req['user'].role) && companyId != currentCompany)
      throw new UnauthorizedException();

    return this.machineService.update(+id, updateMachineDto);
  }

  @Delete(':id')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP])
  async remove(@Param('id') id: string, @Request() req) {
    const machine = await this.machineService.findOne(+id)
    let companyId: number | null = null;
    if(machine.siteId) {
      const site = await this.siteService.findOne(+machine.siteId);
      companyId = site.companyId;
    } else if(machine.lineId) {
      const line = await this.lineService.findOne(+machine.lineId);
      companyId = line.site.companyId;
    }
    const currentCompany = req['user'].companies.find(c => !c.endedAt)?.companyId;
    if(![ROLES.SYSTEM, ROLES.IFDAMANAGER].includes(req['user'].role) && companyId != currentCompany)
      throw new UnauthorizedException();

    return this.machineService.remove(+id);
  }
}
