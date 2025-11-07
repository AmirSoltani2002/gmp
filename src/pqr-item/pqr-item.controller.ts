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
import { PqrItemService } from './pqr-item.service';
import { CreatePqrItemDto } from './dto/create-pqr-item.dto';
import { UpdatePqrItemDto } from './dto/update-pqr-item.dto';
import { FindAllPqrItemDto } from './dto/find-all-pqr-item.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('pqr-item')
@ApiBearerAuth('bearer-key')
@Controller('pqr-item')
export class PqrItemController {
  constructor(private readonly pqrItemService: PqrItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PQR item' })
  @ApiResponse({ status: 201, description: 'PQR item created successfully' })
  create(@Body() createPqrItemDto: CreatePqrItemDto) {
    return this.pqrItemService.create(createPqrItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PQR items with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of PQR items with pagination' })
  findAll(@Query() query: FindAllPqrItemDto) {
    return this.pqrItemService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single PQR item by ID' })
  @ApiResponse({ status: 200, description: 'PQR item found' })
  @ApiResponse({ status: 404, description: 'PQR item not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pqrItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PQR item' })
  @ApiResponse({ status: 200, description: 'PQR item updated successfully' })
  @ApiResponse({ status: 404, description: 'PQR item not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePqrItemDto: UpdatePqrItemDto,
  ) {
    return this.pqrItemService.update(id, updatePqrItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PQR item' })
  @ApiResponse({ status: 200, description: 'PQR item deleted successfully' })
  @ApiResponse({ status: 404, description: 'PQR item not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pqrItemService.remove(id);
  }

  @Get('section/:sectionId')
  @ApiOperation({ summary: 'Get PQR items by section' })
  getBySection(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return this.pqrItemService.findBySection(sectionId);
  }
}
