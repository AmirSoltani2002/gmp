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
import { InspectionInspectorService } from './inspection-inspector.service';
import { CreateInspectionInspectorDto } from './dto/create-inspection-inspector.dto';
import { UpdateInspectionInspectorDto } from './dto/update-inspection-inspector.dto';
import { FindAllInspectionInspectorDto } from './dto/find-all-inspection-inspector.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('inspection-inspector')
@ApiBearerAuth('bearer-key')
@Controller('inspection-inspector')
export class InspectionInspectorController {
  constructor(private readonly inspectionInspectorService: InspectionInspectorService) {}

  @Post()
  @ApiOperation({ summary: 'Assign an inspector to an inspection' })
  @ApiResponse({ status: 201, description: 'Inspector assigned successfully' })
  create(@Body() createInspectionInspectorDto: CreateInspectionInspectorDto) {
    return this.inspectionInspectorService.create(createInspectionInspectorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inspection-inspector assignments with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of assignments with pagination' })
  findAll(@Query() query: FindAllInspectionInspectorDto) {
    return this.inspectionInspectorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single inspection-inspector assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment found' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inspectionInspectorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inspection-inspector assignment' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInspectionInspectorDto: UpdateInspectionInspectorDto,
  ) {
    return this.inspectionInspectorService.update(id, updateInspectionInspectorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an inspector from an inspection' })
  @ApiResponse({ status: 200, description: 'Inspector removed successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inspectionInspectorService.remove(id);
  }

  @Get('inspection/:inspectionId')
  @ApiOperation({ summary: 'Get all inspectors for a specific inspection' })
  getByInspection(@Param('inspectionId', ParseIntPipe) inspectionId: number) {
    return this.inspectionInspectorService.findByInspection(inspectionId);
  }

  @Get('person/:personId')
  @ApiOperation({ summary: 'Get all inspections for a specific person' })
  getByPerson(@Param('personId', ParseIntPipe) personId: number) {
    return this.inspectionInspectorService.findByPerson(personId);
  }
}
