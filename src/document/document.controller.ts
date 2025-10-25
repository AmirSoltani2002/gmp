import {
  Controller,
  Get,
  Post,
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
  'GET': [ROLES.SYSTEM],
  'POST': [ROLES.SYSTEM],
  'DELETE': [ROLES.SYSTEM],
})
@ApiTags('document')
@ApiBearerAuth('bearer-key')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload document (System Admin only)' })
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
  @ApiOperation({ summary: 'Get all documents (System Admin only)' })
  findAll(@Query() query: FindAllDocumentDto) {
    return this.documentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID (System Admin only)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download URL for document (System Admin only)' })
  getDownloadUrl(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.getDownloadUrl(id);
  }
}