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
import { DrugService } from './drug.service';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { PersonService } from 'src/person/person.service';

@Controller('drug')
export class DrugController {
  constructor(private readonly drugService: DrugService,
              private readonly personService: PersonService) {}

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Post()
  create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugService.create(createDrugDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('id')) sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('asc')) sortOrder: 'asc' | 'desc',
    @Query('q') q: string,
  ) {
    return this.drugService.findAll(page, limit, sortBy, sortOrder, q);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.drugService.findOne(id);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDrugDto: UpdateDrugDto,
  ) {
    return this.drugService.update(id, updateDrugDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.drugService.remove(id);
  }
}
