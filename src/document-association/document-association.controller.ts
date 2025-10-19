import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
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
  createSiteAssociation(@Body() dto: CreateDocumentAssociationDto) {
    return this.service.createAssociation('site', dto);
  }

  @Get('site')
  @ApiOperation({ summary: 'Get all site-document associations' })
  findAllSiteAssociations(@Query() query: FindAllDocumentAssociationDto) {
    return this.service.findAllAssociations('site', query);
  }

  @Get('site/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a site' })
  getSiteDocuments(@Param('entityId', ParseIntPipe) entityId: number) {
    return this.service.getDocumentsForEntity('site', entityId);
  }

  @Get('site/document/:documentId/entities')
  @ApiOperation({ summary: 'Get all sites for a document' })
  getSiteEntities(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.service.getEntitiesForDocument('site', documentId);
  }

  @Delete('site/:id')
  @ApiOperation({ summary: 'Remove site-document association' })
  removeSiteAssociation(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAssociation('site', id);
  }

  // Line Document Associations
  @Post('line')
  @ApiOperation({ summary: 'Associate document with line' })
  createLineAssociation(@Body() dto: CreateDocumentAssociationDto) {
    return this.service.createAssociation('line', dto);
  }

  @Get('line')
  @ApiOperation({ summary: 'Get all line-document associations' })
  findAllLineAssociations(@Query() query: FindAllDocumentAssociationDto) {
    return this.service.findAllAssociations('line', query);
  }

  @Get('line/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a line' })
  getLineDocuments(@Param('entityId', ParseIntPipe) entityId: number) {
    return this.service.getDocumentsForEntity('line', entityId);
  }

  @Get('line/document/:documentId/entities')
  @ApiOperation({ summary: 'Get all lines for a document' })
  getLineEntities(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.service.getEntitiesForDocument('line', documentId);
  }

  @Delete('line/:id')
  @ApiOperation({ summary: 'Remove line-document association' })
  removeLineAssociation(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAssociation('line', id);
  }

  // Company Document Associations
  @Post('company')
  @ApiOperation({ summary: 'Associate document with company' })
  createCompanyAssociation(@Body() dto: CreateDocumentAssociationDto) {
    return this.service.createAssociation('company', dto);
  }

  @Get('company')
  @ApiOperation({ summary: 'Get all company-document associations' })
  findAllCompanyAssociations(@Query() query: FindAllDocumentAssociationDto) {
    return this.service.findAllAssociations('company', query);
  }

  @Get('company/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a company' })
  getCompanyDocuments(@Param('entityId', ParseIntPipe) entityId: number) {
    return this.service.getDocumentsForEntity('company', entityId);
  }

  @Get('company/document/:documentId/entities')
  @ApiOperation({ summary: 'Get all companies for a document' })
  getCompanyEntities(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.service.getEntitiesForDocument('company', documentId);
  }

  @Delete('company/:id')
  @ApiOperation({ summary: 'Remove company-document association' })
  removeCompanyAssociation(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAssociation('company', id);
  }

  // Request126 Document Associations
  @Post('request126')
  @ApiOperation({ summary: 'Associate document with request126' })
  createRequest126Association(@Body() dto: CreateDocumentAssociationDto) {
    return this.service.createAssociation('request126', dto);
  }

  @Get('request126')
  @ApiOperation({ summary: 'Get all request126-document associations' })
  findAllRequest126Associations(@Query() query: FindAllDocumentAssociationDto) {
    return this.service.findAllAssociations('request126', query);
  }

  @Get('request126/entity/:entityId/documents')
  @ApiOperation({ summary: 'Get all documents for a request126' })
  getRequest126Documents(@Param('entityId', ParseIntPipe) entityId: number) {
    return this.service.getDocumentsForEntity('request126', entityId);
  }

  @Get('request126/document/:documentId/entities')
  @ApiOperation({ summary: 'Get all request126s for a document' })
  getRequest126Entities(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.service.getEntitiesForDocument('request126', documentId);
  }

  @Delete('request126/:id')
  @ApiOperation({ summary: 'Remove request126-document association' })
  removeRequest126Association(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeAssociation('request126', id);
  }
}