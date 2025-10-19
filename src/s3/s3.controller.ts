import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { S3Service } from './s3.service';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { UploadFileDto } from './dto/upload-file.dto';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import { ListFilesDto } from './dto/list-files.dto';
import { DeleteFileDto, DeleteMultipleFilesDto } from './dto/delete-file.dto';
import { CopyFileDto } from './dto/copy-file.dto';

@ApiTags('🔒 S3 File Management (System Admin Only)')
@ApiBearerAuth('bearer-key')
@MethodPermissions({
  'GET': [ROLES.SYSTEM],     // 🔒 Only system admin can read/download files
  'POST': [ROLES.SYSTEM],    // 🔒 Only system admin can upload files
  'PATCH': [ROLES.SYSTEM],   // 🔒 Only system admin can modify files
  'DELETE': [ROLES.SYSTEM]   // 🔒 Only system admin can delete files
})
@Controller('files')
export class S3Controller {
  /**
   * 🔒 **RESTRICTED ACCESS - SYSTEM ADMINISTRATORS ONLY**
   * 
   * This controller manages S3 file operations and is restricted to system administrators only.
   * All operations (upload, download, delete, list, etc.) require SYSTEM role permissions.
   * 
   * Security Policy:
   * - GET operations: SYSTEM role only
   * - POST operations: SYSTEM role only
   * - PATCH operations: SYSTEM role only
   * - DELETE operations: SYSTEM role only
   * 
   * No other roles (QRP, IFDAUSER, IFDAMANAGER, COMPANYOTHER) have access to file management.
   */
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '📤 Upload File to S3 (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Upload a file to S3 storage with optional folder organization and metadata',
  })
  @ApiBody({
    description: 'File upload with optional parameters',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        folder: {
          type: 'string',
          description: 'Optional folder to store the file',
          example: 'documents',
        },
        fileName: {
          type: 'string',
          description: 'Optional custom file name',
          example: 'my-document.pdf',
        },
        metadata: {
          type: 'object',
          description: 'Optional metadata as JSON string',
          example: '{"userId": "123", "category": "report"}',
        },
        tags: {
          type: 'object',
          description: 'Optional tags as JSON string',
          example: '{"environment": "production", "type": "report"}',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '✅ File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'documents/my-document-2025-10-19.pdf' },
        url: { type: 'string', example: 'https://bucket.s3.region.amazonaws.com/documents/my-document.pdf' },
        bucket: { type: 'string', example: 'gmp-backend-files' },
        size: { type: 'number', example: 1024 },
        contentType: { type: 'string', example: 'application/pdf' },
        etag: { type: 'string', example: '"d41d8cd98f00b204e9800998ecf8427e"' },
      },
    },
  })
  @ApiResponse({ status: 400, description: '❌ Bad Request - No file provided' })
  @ApiResponse({ status: 403, description: '⛔ Forbidden - Insufficient permissions' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      // Parse metadata and tags if they're JSON strings
      let metadata = uploadDto.metadata;
      let tags = uploadDto.tags;

      if (typeof metadata === 'string') {
        metadata = JSON.parse(metadata);
      }
      if (typeof tags === 'string') {
        tags = JSON.parse(tags);
      }

      return await this.s3Service.uploadMulterFile(file, {
        folder: uploadDto.folder,
        fileName: uploadDto.fileName,
        metadata,
        tags,
      });
    } catch (error) {
      throw new HttpException(
        `Upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('download/:key')
  @ApiOperation({
    summary: '📥 Download File from S3 (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Download a file directly from S3 storage',
  })
  @ApiParam({
    name: 'key',
    description: 'File key in S3 (supports nested paths)',
    example: 'documents/my-document.pdf',
  })
  @ApiResponse({
    status: 200,
    description: '✅ File downloaded successfully',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '🔍 File not found' })
  async downloadFile(@Param('key') key: string, @Res() res: Response) {
    try {
      const fileBuffer = await this.s3Service.downloadFile(key);
      const fileInfo = await this.s3Service.getFileInfo(key);

      res.set({
        'Content-Type': fileInfo.contentType,
        'Content-Length': fileInfo.size.toString(),
        'Content-Disposition': `attachment; filename="${key.split('/').pop()}"`,
      });

      res.send(fileBuffer);
    } catch (error) {
      if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Download failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('presigned-download')
  @ApiOperation({
    summary: '🔗 Get Presigned Download URL (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Get a temporary signed URL for downloading a file',
  })
  @ApiQuery({ name: 'key', description: 'File key in S3', example: 'documents/my-document.pdf' })
  @ApiQuery({ name: 'expiresIn', description: 'URL expiration in seconds', example: 3600, required: false })
  @ApiResponse({
    status: 200,
    description: '✅ Presigned URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://bucket.s3.region.amazonaws.com/file?X-Amz-...' },
        expiresIn: { type: 'number', example: 3600 },
        key: { type: 'string', example: 'documents/my-document.pdf' },
      },
    },
  })
  async getPresignedDownloadUrl(@Query() query: GetPresignedUrlDto) {
    try {
      const url = await this.s3Service.getPresignedDownloadUrl(
        query.key,
        query.expiresIn,
      );

      return {
        url,
        expiresIn: query.expiresIn,
        key: query.key,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to generate presigned URL: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('presigned-upload')
  @ApiOperation({
    summary: '📤 Get Presigned Upload URL (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Get a temporary signed URL for uploading a file directly to S3',
  })
  @ApiBody({
    description: 'Upload URL request',
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string', example: 'documents/my-document.pdf' },
        contentType: { type: 'string', example: 'application/pdf' },
        expiresIn: { type: 'number', example: 3600 },
      },
      required: ['key', 'contentType'],
    },
  })
  @ApiResponse({
    status: 200,
    description: '✅ Presigned upload URL generated successfully',
  })
  async getPresignedUploadUrl(
    @Body() body: { key: string; contentType: string; expiresIn?: number },
  ) {
    try {
      const url = await this.s3Service.getPresignedUploadUrl(
        body.key,
        body.contentType,
        body.expiresIn || 3600,
      );

      return {
        url,
        expiresIn: body.expiresIn || 3600,
        key: body.key,
        contentType: body.contentType,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to generate presigned upload URL: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list')
  @ApiOperation({
    summary: '📋 List Files (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - List files in S3 with optional prefix filtering',
  })
  @ApiQuery({ name: 'prefix', description: 'Prefix to filter files', required: false })
  @ApiQuery({ name: 'maxKeys', description: 'Maximum number of files', required: false })
  @ApiResponse({
    status: 200,
    description: '✅ Files listed successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          size: { type: 'number' },
          lastModified: { type: 'string', format: 'date-time' },
          contentType: { type: 'string' },
          etag: { type: 'string' },
        },
      },
    },
  })
  async listFiles(@Query() query: ListFilesDto) {
    try {
      return await this.s3Service.listFiles(query.prefix, query.maxKeys);
    } catch (error) {
      throw new HttpException(
        `Failed to list files: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('info/:key')
  @ApiOperation({
    summary: 'ℹ️ Get File Info (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Get metadata and information about a file',
  })
  @ApiParam({
    name: 'key',
    description: 'File key in S3',
    example: 'documents/my-document.pdf',
  })
  @ApiResponse({
    status: 200,
    description: '✅ File info retrieved successfully',
  })
  @ApiResponse({ status: 404, description: '🔍 File not found' })
  async getFileInfo(@Param('key') key: string) {
    try {
      return await this.s3Service.getFileInfo(key);
    } catch (error) {
      if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Failed to get file info: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':key')
  @ApiOperation({
    summary: '🗑️ Delete File (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Delete a file from S3 storage',
  })
  @ApiParam({
    name: 'key',
    description: 'File key in S3 to delete',
    example: 'documents/my-document.pdf',
  })
  @ApiResponse({
    status: 200,
    description: '✅ File deleted successfully',
  })
  @ApiResponse({ status: 404, description: '🔍 File not found' })
  async deleteFile(@Param('key') key: string) {
    try {
      await this.s3Service.deleteFile(key);
      return { message: 'File deleted successfully', key };
    } catch (error) {
      throw new HttpException(
        `Failed to delete file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete-multiple')
  @ApiOperation({
    summary: '🗑️ Delete Multiple Files (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Delete multiple files from S3 storage',
  })
  @ApiBody({
    description: 'Array of file keys to delete',
    type: DeleteMultipleFilesDto,
  })
  @ApiResponse({
    status: 200,
    description: '✅ Files deleted successfully',
  })
  async deleteMultipleFiles(@Body() deleteDto: DeleteMultipleFilesDto) {
    try {
      await this.s3Service.deleteFiles(deleteDto.keys);
      return {
        message: 'Files deleted successfully',
        deletedCount: deleteDto.keys.length,
        keys: deleteDto.keys,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete files: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('copy')
  @ApiOperation({
    summary: '📋 Copy File (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Copy a file within S3 storage',
  })
  @ApiBody({
    description: 'Source and destination keys',
    type: CopyFileDto,
  })
  @ApiResponse({
    status: 200,
    description: '✅ File copied successfully',
  })
  async copyFile(@Body() copyDto: CopyFileDto) {
    try {
      await this.s3Service.copyFile(copyDto.sourceKey, copyDto.destinationKey);
      return {
        message: 'File copied successfully',
        sourceKey: copyDto.sourceKey,
        destinationKey: copyDto.destinationKey,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to copy file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('exists/:key')
  @ApiOperation({
    summary: '❓ Check File Exists (Admin Only)',
    description: '🔒 **SYSTEM ADMIN ONLY** - Check if a file exists in S3 storage',
  })
  @ApiParam({
    name: 'key',
    description: 'File key in S3 to check',
    example: 'documents/my-document.pdf',
  })
  @ApiResponse({
    status: 200,
    description: '✅ File existence check completed',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean' },
        key: { type: 'string' },
      },
    },
  })
  async checkFileExists(@Param('key') key: string) {
    try {
      const exists = await this.s3Service.fileExists(key);
      return { exists, key };
    } catch (error) {
      throw new HttpException(
        `Failed to check file existence: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}