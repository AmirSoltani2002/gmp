import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FindAllInspectionDto } from './dto/find-all-inspection.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('inspection')
@ApiBearerAuth('bearer-key')
@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inspection' })
  @ApiResponse({ status: 201, description: 'Inspection created successfully' })
  create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionService.create(createInspectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inspections with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of inspections with pagination' })
  findAll(@Query() query: FindAllInspectionDto) {
    return this.inspectionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single inspection by ID' })
  @ApiResponse({ status: 200, description: 'Inspection found' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inspectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inspection' })
  @ApiResponse({ status: 200, description: 'Inspection updated successfully' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ) {
    return this.inspectionService.update(id, updateInspectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inspection' })
  @ApiResponse({ status: 200, description: 'Inspection deleted successfully' })
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inspectionService.remove(id);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get inspections by company' })
  getByCompany(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.inspectionService.findByCompany(companyId);
  }

  @Get('line/:lineId')
  @ApiOperation({ summary: 'Get inspections by line' })
  getByLine(@Param('lineId', ParseIntPipe) lineId: number) {
    return this.inspectionService.findByLine(lineId);
  }
}
