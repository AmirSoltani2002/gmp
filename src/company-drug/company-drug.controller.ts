import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
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
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('sortBy', new DefaultValuePipe('id')) sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('asc')) sortOrder: 'asc' | 'desc',
  ) {
    return this.companyDrugService.findAll(
      page,
      pageSize,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyDrugService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDrugDto: UpdateCompanyDrugDto,
  ) {
    return this.companyDrugService.update(id, updateCompanyDrugDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyDrugService.remove(id);
  }
}
