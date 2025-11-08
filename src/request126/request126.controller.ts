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
  BadRequestException,
} from '@nestjs/common';
import { Request126Service } from './request126.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { FindAllRequest126Dto } from './dto/find-all-request126.dto';
import { AssignRequest126Dto } from './dto/assign-request126.dto';
import { SendBackRequest126Dto } from './dto/send-back-request126.dto';
import { MethodPermissions, Roles } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request as NestRequest } from '@nestjs/common';
import { AccessControlUtils } from '../common/access-control.utils';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP]
})
@ApiTags('request126')
@ApiBearerAuth('bearer-key')
@Controller('request126')
export class Request126Controller {
  constructor(private readonly request126Service: Request126Service) {}

  @Post()
  @ApiOperation({ summary: 'Create a new request126' })
  @ApiResponse({ status: 201, description: 'Request126 created successfully' })
  create(@Body() createRequest126Dto: CreateRequest126Dto, @NestRequest() req: any) {
    const userId = AccessControlUtils.validateUserId(req);
    const actor = req['user'];
    if (!userId || !actor) {
      // Fallback to original behavior if user not present (should not happen behind auth)
      return this.request126Service.create(createRequest126Dto);
    }
    return this.request126Service.createWithHistory(createRequest126Dto, actor);
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
    @NestRequest() req: any,
  ) {
    const actor = req['user'];
    return this.request126Service.update(id, updateRequest126Dto, actor);
  }

  @Post(':id/submit')
  @Roles([ROLES.QRP])
  @ApiOperation({ summary: 'Submit a request126 (changes status from draft to pendingAssign)' })
  @ApiResponse({ status: 200, description: 'Request126 submitted successfully' })
  @ApiResponse({ status: 400, description: 'Request cannot be submitted (not in draft status or insufficient permissions)' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  submit(
    @Param('id', ParseIntPipe) id: number,
    @NestRequest() req: any,
  ) {
    const actor = req['user'];
    if (!actor) {
      throw new BadRequestException('Invalid actor');
    }
    return this.request126Service.submit(id, actor);
  }

  @Post(':id/assign')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  @ApiOperation({ summary: 'Assign a request126 to an IFDA user (changes status to pendingReview)' })
  @ApiResponse({ status: 200, description: 'Request126 assigned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid assignee or insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRequest126Dto: AssignRequest126Dto,
    @NestRequest() req: any,
  ) {
    const actor = req['user'];
    if (!actor) {
      throw new BadRequestException('Invalid actor');
    }
    return this.request126Service.assign(id, assignRequest126Dto, actor);
  }

  @Post(':id/send-back')
  @Roles([ROLES.IFDAUSER, ROLES.SYSTEM])
  @ApiOperation({ summary: 'Send request back to manager for final decision (changes status to pendingDecision)' })
  @ApiResponse({ status: 200, description: 'Request sent back to manager successfully' })
  @ApiResponse({ status: 400, description: 'Request not in pendingReview status or insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  sendBackToManager(
    @Param('id', ParseIntPipe) id: number,
    @Body() sendBackRequest126Dto: SendBackRequest126Dto,
    @NestRequest() req: any,
  ) {
    const actor = req['user'];
    if (!actor) {
      throw new BadRequestException('Invalid actor');
    }
    return this.request126Service.sendBackToManager(id, actor, sendBackRequest126Dto.message);
  }

  @Post(':id/approve')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  @ApiOperation({ summary: 'Approve a request126 (changes status to approved)' })
  @ApiResponse({ status: 200, description: 'Request126 approved successfully' })
  @ApiResponse({ status: 400, description: 'Request not in pendingAssign status or insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  approve(
    @Param('id', ParseIntPipe) id: number,
    @NestRequest() req: any,
  ) {
    const actor = req['user'];
    if (!actor) {
      throw new BadRequestException('Invalid actor');
    }
    return this.request126Service.approve(id, actor);
  }

  @Post(':id/reject')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  @ApiOperation({ summary: 'Reject a request126 (changes status to rejected)' })
  @ApiResponse({ status: 200, description: 'Request126 rejected successfully' })
  @ApiResponse({ status: 400, description: 'Request not in pendingAssign status or insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  reject(
    @Param('id', ParseIntPipe) id: number,
    @NestRequest() req: any,
  ) {
    const actor = req['user'];
    if (!actor) {
      throw new BadRequestException('Invalid actor');
    }
    return this.request126Service.reject(id, actor);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a request126' })
  @ApiResponse({ status: 200, description: 'Request126 deleted successfully' })
  @ApiResponse({ status: 404, description: 'Request126 not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.request126Service.remove(id);
  }
}
