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
import { PqrAnswerService } from './pqr-answer.service';
import { CreatePqrAnswerDto } from './dto/create-pqr-answer.dto';
import { UpdatePqrAnswerDto } from './dto/update-pqr-answer.dto';
import { FindAllPqrAnswerDto } from './dto/find-all-pqr-answer.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.QRP, ROLES.COMPANYOTHER],
  'PATCH': [ROLES.SYSTEM, ROLES.QRP, ROLES.COMPANYOTHER],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('pqr-answer')
@ApiBearerAuth('bearer-key')
@Controller('pqr-answer')
export class PqrAnswerController {
  constructor(private readonly pqrAnswerService: PqrAnswerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PQR answer' })
  @ApiResponse({ status: 201, description: 'PQR answer created successfully' })
  create(@Body() createPqrAnswerDto: CreatePqrAnswerDto) {
    return this.pqrAnswerService.create(createPqrAnswerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PQR answers with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of PQR answers with pagination' })
  findAll(@Query() query: FindAllPqrAnswerDto) {
    return this.pqrAnswerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single PQR answer by ID' })
  @ApiResponse({ status: 200, description: 'PQR answer found' })
  @ApiResponse({ status: 404, description: 'PQR answer not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pqrAnswerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PQR answer' })
  @ApiResponse({ status: 200, description: 'PQR answer updated successfully' })
  @ApiResponse({ status: 404, description: 'PQR answer not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePqrAnswerDto: UpdatePqrAnswerDto,
  ) {
    return this.pqrAnswerService.update(id, updatePqrAnswerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PQR answer' })
  @ApiResponse({ status: 200, description: 'PQR answer deleted successfully' })
  @ApiResponse({ status: 404, description: 'PQR answer not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pqrAnswerService.remove(id);
  }

  @Get('form/:formId')
  @ApiOperation({ summary: 'Get all answers for a specific form' })
  getByForm(@Param('formId', ParseIntPipe) formId: number) {
    return this.pqrAnswerService.findByForm(formId);
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Get all answers for a specific item' })
  getByItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.pqrAnswerService.findByItem(itemId);
  }
}
