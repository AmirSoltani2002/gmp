import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { FindAllDocumentDto } from './dto/find-all-document.dto';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PersonService } from 'src/person/person.service';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.QRP],
})
@ApiTags('document')
@ApiBearerAuth('bearer-key')
@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly personService: PersonService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload document (System Admin, QRP, IFDAUser, IFDAManager, CompanyOther only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
          example: 'Safety Protocol Document',
        },
        description: {
          type: 'string',
          example: 'Description of the document',
        },
      },
    },
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @Request() req,
  ) {
    const person = await this.personService.findOne(req.user?.id);
    const personCompanyId = person.companies?.[0]?.company?.id;
    return this.documentService.upload(file, dto, personCompanyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents (System Admin, QRP, IFDAUser, IFDAManager, CompanyOther only)' })
  async findAll(@Query() query: FindAllDocumentDto, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.documentService.findAll(query, person);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID (System Admin, QRP, IFDAUser, IFDAManager, CompanyOther only)' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.documentService.findOne(id, person?.companies?.[0]?.company?.id, person);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download URL for document (System Admin, QRP, IFDAUser, IFDAManager, CompanyOther only)' })
  async getDownloadUrl(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const person = await this.personService.findOne(req.user?.id);
    return this.documentService.getDownloadUrl(id, person?.companies?.[0]?.company?.id, person);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update document metadata or replace file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: any,
    @Request() req,
  ) {
    const person = await this.personService.findOne(req.user?.id);
    return this.documentService.update(id, file, dto, person?.companies?.[0]?.company?.id, person);
  }
}