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
  constructor(private readonly documentService: DocumentService) {}

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
      },
    },
  })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @Request() req,
  ) {
    return this.documentService.upload(file, dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents (System Admin, QRP, IFDAUser, IFDAManager, CompanyOther only)' })
  findAll(@Query() query: FindAllDocumentDto, @Request() req) {
    return this.documentService.findAll(query, req.user?.id, req.user?.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID (System Admin, QRP, IFDAUser, IFDAManager, CompanyOther only)' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.documentService.findOne(id, req.user?.id, req.user?.role);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download URL for document (System Admin, QRP, IFDAUser, IFDAManager, CompanyOther only)' })
  getDownloadUrl(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.documentService.getDownloadUrl(id, req.user?.id, req.user?.role);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: any,
    @Request() req,
  ) {
    return this.documentService.update(id, file, dto, req.user?.id, req.user?.role);
  }
}