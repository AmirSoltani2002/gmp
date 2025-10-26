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
  Request,
  BadRequestException,
} from '@nestjs/common';
import { CompanyDrugService } from './company-drug.service';
import { CreateCompanyDrugDto } from './dto/create-company-drug.dto';
import { UpdateCompanyDrugDto } from './dto/update-company-drug.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ROLES } from 'src/common/interface';
import { PersonService } from 'src/person/person.service';
import { AccessControlUtils } from 'src/common/access-control.utils';

@Controller('company-drug')
export class CompanyDrugController {
  constructor(private readonly companyDrugService: CompanyDrugService,
              private readonly personService: PersonService) {}

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Post()
  async create(@Body() createCompanyDrugDto: CreateCompanyDrugDto, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const access = await AccessControlUtils.canAccessCompany(user, createCompanyDrugDto.brandOwnerId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.companyDrugService.create(createCompanyDrugDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER])
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

  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.QRP, ROLES.CEO, ROLES.COMPANYOTHER])
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const companyDrug = await this.companyDrugService.findOne(id);
    
    if (!companyDrug) {
      throw new BadRequestException('Company drug not found');
    }
    
    const access = await AccessControlUtils.canAccessCompany(user, companyDrug.brandOwnerId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return companyDrug;
  }

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDrugDto: UpdateCompanyDrugDto,
    @Request() req,
  ) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const companyDrug = await this.companyDrugService.findOne(id);
    
    if (!companyDrug) {
      throw new BadRequestException('Company drug not found');
    }
    
    const access = await AccessControlUtils.canAccessCompany(user, companyDrug.brandOwnerId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.companyDrugService.update(id, updateCompanyDrugDto);
  }

  @Roles([ROLES.SYSTEM, ROLES.QRP])
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = AccessControlUtils.validateUserId(req);
    const user = await this.personService.findOne(userId);
    const companyDrug = await this.companyDrugService.findOne(id);
    
    if (!companyDrug) {
      throw new BadRequestException('Company drug not found');
    }
    
    const access = await AccessControlUtils.canAccessCompany(user, companyDrug.brandOwnerId);
    
    if (!access.canAccess) {
      throw new BadRequestException(access.message || 'Access denied');
    }
    
    return this.companyDrugService.remove(id);
  }
}
