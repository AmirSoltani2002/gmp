import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MachineTypeService } from './machine-type.service';
import { CreateMachineTypeDto } from './dto/create-machine-type.dto';
import { UpdateMachineTypeDto } from './dto/update-machine-type.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';

@Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
@Controller('machine-type')
export class MachineTypeController {
  constructor(private readonly machineTypeService: MachineTypeService) {}

  @Post()
  create(@Body() createMachineTypeDto: CreateMachineTypeDto) {
    return this.machineTypeService.create(createMachineTypeDto);
  }

  @Get()
  @Roles([ROLES.CEO, ROLES.COMPANYOTHER, ROLES.IFDAMANAGER, ROLES.IFDAUSER, ROLES.QRP, ROLES.SYSTEM])
  findAll() {
    return this.machineTypeService.findAll();
  }

  @Get(':id')
  @Roles([ROLES.CEO, ROLES.COMPANYOTHER, ROLES.IFDAMANAGER, ROLES.IFDAUSER, ROLES.QRP, ROLES.SYSTEM])
  findOne(@Param('id') id: string) {
    return this.machineTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMachineTypeDto: UpdateMachineTypeDto) {
    return this.machineTypeService.update(+id, updateMachineTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machineTypeService.remove(+id);
  }
}
