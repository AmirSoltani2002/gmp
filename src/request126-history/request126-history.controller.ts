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
import { Request126HistoryService } from './request126-history.service';
import { CreateRequest126HistoryDto } from './dto/create-request126-history.dto';
import { UpdateRequest126HistoryDto } from './dto/update-request126-history.dto';
import { FindAllRequest126HistoryDto } from './dto/find-all-request126-history.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('request126-history')
@ApiBearerAuth('bearer-key')
@Controller('request126-history')
export class Request126HistoryController {
  constructor(private readonly request126HistoryService: Request126HistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new request126 history entry' })
  @ApiResponse({ status: 201, description: 'History entry created successfully' })
  create(@Body() createRequest126HistoryDto: CreateRequest126HistoryDto) {
    return this.request126HistoryService.create(createRequest126HistoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all request126 history entries with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of history entries with pagination' })
  findAll(@Query() query: FindAllRequest126HistoryDto) {
    return this.request126HistoryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single request126 history entry by ID' })
  @ApiResponse({ status: 200, description: 'History entry found' })
  @ApiResponse({ status: 404, description: 'History entry not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.request126HistoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a request126 history entry' })
  @ApiResponse({ status: 200, description: 'History entry updated successfully' })
  @ApiResponse({ status: 404, description: 'History entry not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRequest126HistoryDto: UpdateRequest126HistoryDto,
  ) {
    return this.request126HistoryService.update(id, updateRequest126HistoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a request126 history entry' })
  @ApiResponse({ status: 200, description: 'History entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'History entry not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.request126HistoryService.remove(id);
  }

  @Get('request/:requestId')
  @ApiOperation({ summary: 'Get history entries for a specific request' })
  getByRequest(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.request126HistoryService.findByRequest(requestId);
  }

  @Get('actor/:actorId')
  @ApiOperation({ summary: 'Get history entries by actor (person who performed actions)' })
  getByActor(@Param('actorId', ParseIntPipe) actorId: number) {
    return this.request126HistoryService.findByActor(actorId);
  }
}