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
import { Request126Service } from './request126.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { FindAllRequest126Dto } from './dto/find-all-request126.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('request126')
@ApiBearerAuth('bearer-key')
@Controller('request126')
export class Request126Controller {
  constructor(private readonly request126Service: Request126Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new request126' })
  @ApiResponse({ status: 201, description: 'Request126 created successfully' })
  create(@Body() createRequest126Dto: CreateRequest126Dto) {
    return this.request126Service.create(createRequest126Dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all request126s with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of request126s with pagination' })
  findAll(@Query() query: FindAllRequest126Dto) {
    return this.request126Service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single request126 by ID' })
  @ApiResponse({ status: 200, description: 'Request126 found' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.request126Service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a request126' })
  @ApiResponse({ status: 200, description: 'Request126 updated successfully' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRequest126Dto: UpdateRequest126Dto,
  ) {
    return this.request126Service.update(id, updateRequest126Dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a request126' })
  @ApiResponse({ status: 200, description: 'Request126 deleted successfully' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.request126Service.remove(id);
  }
}
