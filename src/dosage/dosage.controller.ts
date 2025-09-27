import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DosageService } from './dosage.service';
import { CreateDosageDto } from './dto/create-dosage.dto';
import { UpdateDosageDto } from './dto/update-dosage.dto';
import { Roles, RolesNot } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';

@Roles([ROLES.IFDAMANAGER, ROLES.SYSTEM])
@Controller('dosage')
export class DosageController {
  constructor(private readonly dosageService: DosageService) {}

  @Post()
  create(@Body() createDosageDto: CreateDosageDto) {
    return this.dosageService.create(createDosageDto);
  }

  @Roles([ROLES.CEO, ROLES.COMPANYOTHER, ROLES.IFDAMANAGER, ROLES.IFDAUSER, ROLES.QRP, ROLES.SYSTEM])
  @Get()
  findAll() {
    return this.dosageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dosageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDosageDto: UpdateDosageDto) {
    return this.dosageService.update(+id, updateDosageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dosageService.remove(+id);
  }
}
