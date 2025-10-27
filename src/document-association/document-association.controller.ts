import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { DocumentAssociationService } from './document-association.service';
import { CreateDocumentAssociationDto } from './dto/create-document-association.dto';
import { FindAllDocumentAssociationDto } from './dto/find-all-document-association.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PersonService } from 'src/person/person.service';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP]
})
@ApiTags('document-associations')
@ApiBearerAuth('bearer-key')
@Controller('document-association')
export class DocumentAssociationController {
  constructor(
    private readonly service: DocumentAssociationService,
    private readonly personService: PersonService
  ) {}

  // Site Document Associations
  @Post('site')
  @ApiOperation({ summary: 'Associate document with site' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  @ApiResponse({ status: 409, description: 'Document already associated with another site' })
  createSiteAssociation(@Body() dto: CreateDocumentAssociationDto, @Request() req) {
    return this.service.createAssociation('site', dto, req.user?.id, req.user?.role);
  }

  @Get('site')
  @ApiOperation({ summary: 'Get all site-document associations' })
  @ApiResponse({ status: 200, description: 'List of associations with pagination' })
  async findAllSiteAssociations(@Query() query: FindAllDocumentAssociationDto, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.findAllAssociations('site', query, person);
  }

  @Get('site/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a site' })
  @ApiResponse({ status: 200, description: 'List of documents for the site' })
  async getSiteDocuments(@Param('entityId', ParseIntPipe) entityId: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.getDocumentsForEntity('site', entityId, person);
  }

  @Get('site/document/:documentId/entity')
  @ApiOperation({ summary: 'Get site for a document (one-to-one)' })
  @ApiResponse({ status: 200, description: 'Site associated with the document' })
  async getSiteEntity(@Param('documentId', ParseIntPipe) documentId: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.getEntityForDocument('site', documentId, person);
  }

  @Delete('site/:id')
  @ApiOperation({ summary: 'Remove site-document association' })
  @ApiResponse({ status: 204, description: 'Association removed successfully' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async removeSiteAssociation(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.removeAssociation('site', id, person);
  }

  // Line Document Associations
  @Post('line')
  @ApiOperation({ summary: 'Associate document with line' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  @ApiResponse({ status: 409, description: 'Document already associated with another line' })
  createLineAssociation(@Body() dto: CreateDocumentAssociationDto, @Request() req) {
    return this.service.createAssociation('line', dto, req.user?.id, req.user?.role);
  }

  @Get('line')
  @ApiOperation({ summary: 'Get all line-document associations' })
  @ApiResponse({ status: 200, description: 'List of associations with pagination' })
  async findAllLineAssociations(@Query() query: FindAllDocumentAssociationDto, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.findAllAssociations('line', query, person);
  }

  @Get('line/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a line' })
  @ApiResponse({ status: 200, description: 'List of documents for the line' })
  async getLineDocuments(@Param('entityId', ParseIntPipe) entityId: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.getDocumentsForEntity('line', entityId, person);
  }

  @Get('line/document/:documentId/entity')
  @ApiOperation({ summary: 'Get line for a document (one-to-one)' })
  @ApiResponse({ status: 200, description: 'Line associated with the document' })
  @ApiResponse({ status: 404, description: 'No association found' })
  async getLineEntity(@Param('documentId', ParseIntPipe) documentId: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.getEntityForDocument('line', documentId, person);
  }

  @Delete('line/:id')
  @ApiOperation({ summary: 'Remove line-document association' })
  @ApiResponse({ status: 204, description: 'Association removed successfully' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async removeLineAssociation(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.removeAssociation('line', id, person);
  }

  // Company Document Associations
  @Post('company')
  @ApiOperation({ summary: 'Associate document with company' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  @ApiResponse({ status: 409, description: 'Document already associated with another company' })
  createCompanyAssociation(@Body() dto: CreateDocumentAssociationDto, @Request() req) {
    return this.service.createAssociation('company', dto, req.user?.id, req.user?.role);
  }

  @Get('company')
  @ApiOperation({ summary: 'Get all company-document associations' })
  @ApiResponse({ status: 200, description: 'List of associations with pagination' })
  async findAllCompanyAssociations(@Query() query: FindAllDocumentAssociationDto, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.findAllAssociations('company', query, person);
  }

  @Get('company/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a company' })
  @ApiResponse({ status: 200, description: 'List of documents for the company' })
  async getCompanyDocuments(@Param('entityId', ParseIntPipe) entityId: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.getDocumentsForEntity('company', entityId, person);
  }

  @Get('company/document/:documentId/entity')
  @ApiOperation({ summary: 'Get company for a document (one-to-one)' })
  @ApiResponse({ status: 200, description: 'Company associated with the document' })
  @ApiResponse({ status: 404, description: 'No association found' })
  async getCompanyEntity(@Param('documentId', ParseIntPipe) documentId: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.getEntityForDocument('company', documentId, person);
  }

  @Delete('company/:id')
  @ApiOperation({ summary: 'Remove company-document association' })
  @ApiResponse({ status: 204, description: 'Association removed successfully' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async removeCompanyAssociation(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.removeAssociation('company', id, person);
  }

  // Request126 Document Associations
  @Post('request126')
  @ApiOperation({ summary: 'Associate document with request126' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  @ApiResponse({ status: 409, description: 'Document already associated with another request126' })
  createRequest126Association(@Body() dto: CreateDocumentAssociationDto, @Request() req) {
    return this.service.createAssociation('request126', dto, req.user?.id, req.user?.role);
  }

  @Get('request126')
  @ApiOperation({ summary: 'Get all request126-document associations' })
  @ApiResponse({ status: 200, description: 'List of associations with pagination' })
  async findAllRequest126Associations(@Query() query: FindAllDocumentAssociationDto, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.findAllAssociations('request126', query, person);
  }

  @Get('request126/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a request126' })
  @ApiResponse({ status: 200, description: 'List of documents for the request126' })
  async getRequest126Documents(@Param('entityId', ParseIntPipe) entityId: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.getDocumentsForEntity('request126', entityId, person);
  }

  @Get('request126/document/:documentId/entity')
  @ApiOperation({ summary: 'Get request126 for a document (one-to-one)' })
  @ApiResponse({ status: 200, description: 'Request126 associated with the document' })
  @ApiResponse({ status: 404, description: 'No association found' })
  async getRequest126Entity(@Param('documentId', ParseIntPipe) documentId: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.getEntityForDocument('request126', documentId, person);
  }

  @Delete('request126/:id')
  @ApiOperation({ summary: 'Remove request126-document association' })
  @ApiResponse({ status: 204, description: 'Association removed successfully' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  async removeRequest126Association(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.service.removeAssociation('request126', id, person);
  }
}