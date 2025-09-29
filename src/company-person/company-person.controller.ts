import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyPersonService } from './company-person.service';
import { CreateCompanyPersonDto } from './dto/create-company-person.dto';
import { UpdateCompanyPersonDto } from './dto/update-company-person.dto';
import { Roles } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';

@Controller('company-person')
@Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
export class CompanyPersonController {
  constructor(private readonly companyPersonService: CompanyPersonService) {}

  @Post()
  create(@Body() createCompanyPersonDto: CreateCompanyPersonDto) {
    return this.companyPersonService.create(createCompanyPersonDto);
  }

  @Get()
  findAll() {
    return this.companyPersonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyPersonService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyPersonDto: UpdateCompanyPersonDto,
  ) {
    return this.companyPersonService.update(+id, updateCompanyPersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyPersonService.remove(+id);
  }
}