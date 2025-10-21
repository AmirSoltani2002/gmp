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
} from '@nestjs/common';
import { DocumentAssociationService } from './document-association.service';
import { CreateDocumentAssociationDto } from './dto/create-document-association.dto';
import { FindAllDocumentAssociationDto } from './dto/find-all-document-association.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('document-associations')
@ApiBearerAuth('bearer-key')
@Controller('document-association')
export class DocumentAssociationController {
  constructor(private readonly service: DocumentAssociationService) {}

  // Site Document Associations
  @Post('site')
  @ApiOperation({ summary: 'Associate document with site' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  @ApiResponse({ status: 409, description: 'Document already associated with another site' })
  createSiteAssociation(@Body() dto: CreateDocumentAssociationDto) {
    return this.service.createAssociation('site', dto);
  }

  @Get('site')
  @ApiOperation({ summary: 'Get all site-document associations' })
  @ApiResponse({ status: 200, description: 'List of associations with pagination' })
  findAllSiteAssociations(@Query() query: FindAllDocumentAssociationDto) {
    return this.service.findAllAssociations('site', query);
  }

  @Get('site/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a site' })
  @ApiResponse({ status: 200, description: 'List of documents for the site' })
  getSiteDocuments(@Param('entityId', ParseIntPipe) entityId: number) {
    return this.service.getDocumentsForEntity('site', entityId);
  }

  @Get('site/document/:documentId/entity')
  @ApiOperation({ summary: 'Get site for a document (one-to-one)' })
  @ApiResponse({ status: 200, description: 'Site associated with the document' })
  getSiteEntity(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.service.getEntityForDocument('site', documentId);
  }

  @Delete('site/:id')
  @ApiOperation({ summary: 'Remove site-document association' })
  @ApiResponse({ status: 204, description: 'Association removed successfully' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  removeSiteAssociation(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAssociation('site', id);
  }

  // Line Document Associations
  @Post('line')
  @ApiOperation({ summary: 'Associate document with line' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  @ApiResponse({ status: 409, description: 'Document already associated with another line' })
  createLineAssociation(@Body() dto: CreateDocumentAssociationDto) {
    return this.service.createAssociation('line', dto);
  }

  @Get('line')
  @ApiOperation({ summary: 'Get all line-document associations' })
  @ApiResponse({ status: 200, description: 'List of associations with pagination' })
  findAllLineAssociations(@Query() query: FindAllDocumentAssociationDto) {
    return this.service.findAllAssociations('line', query);
  }

  @Get('line/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a line' })
  @ApiResponse({ status: 200, description: 'List of documents for the line' })
  getLineDocuments(@Param('entityId', ParseIntPipe) entityId: number) {
    return this.service.getDocumentsForEntity('line', entityId);
  }

  @Get('line/document/:documentId/entity')
  @ApiOperation({ summary: 'Get line for a document (one-to-one)' })
  @ApiResponse({ status: 200, description: 'Line associated with the document' })
  @ApiResponse({ status: 404, description: 'No association found' })
  getLineEntity(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.service.getEntityForDocument('line', documentId);
  }

  @Delete('line/:id')
  @ApiOperation({ summary: 'Remove line-document association' })
  @ApiResponse({ status: 204, description: 'Association removed successfully' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  removeLineAssociation(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAssociation('line', id);
  }

  // Company Document Associations
  @Post('company')
  @ApiOperation({ summary: 'Associate document with company' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  @ApiResponse({ status: 409, description: 'Document already associated with another company' })
  createCompanyAssociation(@Body() dto: CreateDocumentAssociationDto) {
    return this.service.createAssociation('company', dto);
  }

  @Get('company')
  @ApiOperation({ summary: 'Get all company-document associations' })
  @ApiResponse({ status: 200, description: 'List of associations with pagination' })
  findAllCompanyAssociations(@Query() query: FindAllDocumentAssociationDto) {
    return this.service.findAllAssociations('company', query);
  }

  @Get('company/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a company' })
  @ApiResponse({ status: 200, description: 'List of documents for the company' })
  getCompanyDocuments(@Param('entityId', ParseIntPipe) entityId: number) {
    return this.service.getDocumentsForEntity('company', entityId);
  }

  @Get('company/document/:documentId/entity')
  @ApiOperation({ summary: 'Get company for a document (one-to-one)' })
  @ApiResponse({ status: 200, description: 'Company associated with the document' })
  @ApiResponse({ status: 404, description: 'No association found' })
  getCompanyEntity(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.service.getEntityForDocument('company', documentId);
  }

  @Delete('company/:id')
  @ApiOperation({ summary: 'Remove company-document association' })
  @ApiResponse({ status: 204, description: 'Association removed successfully' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  removeCompanyAssociation(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAssociation('company', id);
  }

  // Request126 Document Associations
  @Post('request126')
  @ApiOperation({ summary: 'Associate document with request126' })
  @ApiResponse({ status: 201, description: 'Association created successfully' })
  @ApiResponse({ status: 409, description: 'Document already associated with another request126' })
  createRequest126Association(@Body() dto: CreateDocumentAssociationDto) {
    return this.service.createAssociation('request126', dto);
  }

  @Get('request126')
  @ApiOperation({ summary: 'Get all request126-document associations' })
  @ApiResponse({ status: 200, description: 'List of associations with pagination' })
  findAllRequest126Associations(@Query() query: FindAllDocumentAssociationDto) {
    return this.service.findAllAssociations('request126', query);
  }

  @Get('request126/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a request126' })
  @ApiResponse({ status: 200, description: 'List of documents for the request126' })
  getRequest126Documents(@Param('entityId', ParseIntPipe) entityId: number) {
    return this.service.getDocumentsForEntity('request126', entityId);
  }

  @Get('request126/document/:documentId/entity')
  @ApiOperation({ summary: 'Get request126 for a document (one-to-one)' })
  @ApiResponse({ status: 200, description: 'Request126 associated with the document' })
  @ApiResponse({ status: 404, description: 'No association found' })
  getRequest126Entity(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.service.getEntityForDocument('request126', documentId);
  }

  @Delete('request126/:id')
  @ApiOperation({ summary: 'Remove request126-document association' })
  @ApiResponse({ status: 204, description: 'Association removed successfully' })
  @ApiResponse({ status: 404, description: 'Association not found' })
  removeRequest126Association(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAssociation('request126', id);
  }
}