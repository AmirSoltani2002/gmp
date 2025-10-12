import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyDrugService } from './company-drug.service';
import { CreateCompanyDrugDto } from './dto/create-company-drug.dto';
import { UpdateCompanyDrugDto } from './dto/update-company-drug.dto';

@Controller('company-drug')
export class CompanyDrugController {
  constructor(private readonly companyDrugService: CompanyDrugService) {}

  @Post()
  create(@Body() createCompanyDrugDto: CreateCompanyDrugDto) {
    return this.companyDrugService.create(createCompanyDrugDto);
  }

  @Get()
  findAll() {
    return this.companyDrugService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyDrugService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDrugDto: UpdateCompanyDrugDto) {
    return this.companyDrugService.update(+id, updateCompanyDrugDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyDrugService.remove(+id);
  }
}
