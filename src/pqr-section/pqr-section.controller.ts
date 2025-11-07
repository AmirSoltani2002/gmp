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
import { PqrSectionService } from './pqr-section.service';
import { CreatePqrSectionDto } from './dto/create-pqr-section.dto';
import { UpdatePqrSectionDto } from './dto/update-pqr-section.dto';
import { FindAllPqrSectionDto } from './dto/find-all-pqr-section.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('pqr-section')
@ApiBearerAuth('bearer-key')
@Controller('pqr-section')
export class PqrSectionController {
  constructor(private readonly pqrSectionService: PqrSectionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PQR section' })
  @ApiResponse({ status: 201, description: 'PQR section created successfully' })
  create(@Body() createPqrSectionDto: CreatePqrSectionDto) {
    return this.pqrSectionService.create(createPqrSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PQR sections with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of PQR sections with pagination' })
  findAll(@Query() query: FindAllPqrSectionDto) {
    return this.pqrSectionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single PQR section by ID' })
  @ApiResponse({ status: 200, description: 'PQR section found' })
  @ApiResponse({ status: 404, description: 'PQR section not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pqrSectionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PQR section' })
  @ApiResponse({ status: 200, description: 'PQR section updated successfully' })
  @ApiResponse({ status: 404, description: 'PQR section not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePqrSectionDto: UpdatePqrSectionDto,
  ) {
    return this.pqrSectionService.update(id, updatePqrSectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PQR section' })
  @ApiResponse({ status: 200, description: 'PQR section deleted successfully' })
  @ApiResponse({ status: 404, description: 'PQR section not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pqrSectionService.remove(id);
  }
}
