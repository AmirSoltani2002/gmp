import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DocumentS3Service } from '../s3/document.s3.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { FindAllDocumentDto } from './dto/find-all-document.dto';
import { ROLES } from '../common/interface';

@Injectable()
export class DocumentService {
  private readonly BUCKET_NAME = process.env.AWS_S3_BUCKET || 'gmp-documents';

  constructor(
    private readonly db: DatabaseService,
    private readonly s3Service: DocumentS3Service,
  ) {}

  async upload(
    file: Express.Multer.File,
    dto: UploadDocumentDto,
    userId?: number,
  ) {
    // Generate unique file key
    const timestamp = Date.now();
    const fileKey = `${timestamp}-${file.originalname}`;

    // Upload to S3
    await this.s3Service.uploadFile(
      this.BUCKET_NAME,
      fileKey,
      file.buffer,
      file.mimetype,
    );

    // Save metadata to database
    return this.db.document.create({
      data: {
        title: dto.title,
        description: dto.description,
        fileName: file.originalname,
        fileKey,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
      },
    });
  }

  async findAll(query: FindAllDocumentDto, userId?: number, userRole?: string) {
    const { page = 1, pageSize = 20, q } = query;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { fileName: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // If user is QRP, only show their own documents
    if (userRole === ROLES.QRP && userId) {
      where.uploadedBy = userId;
    }

    const [items, totalItems] = await this.db.$transaction([
      this.db.document.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.document.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: items,
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
    };
  }

  async findOne(id: number, userId?: number, userRole?: string) {
    const document = await this.db.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // If user is QRP, only allow access to their own documents
    if (userRole === ROLES.QRP && userId && document.uploadedBy !== userId) {
      throw new ForbiddenException('You can only access your own documents');
    }

    return document;
  }

  async getDownloadUrl(id: number, userId?: number, userRole?: string) {
    const document = await this.findOne(id, userId, userRole);
    return this.s3Service.getPresignedUrl(this.BUCKET_NAME, document.fileKey);
  }

  async remove(id: number, userId?: number, userRole?: string) {
    const document = await this.findOne(id, userId, userRole);

    // Delete from S3
    await this.s3Service.deleteFile(this.BUCKET_NAME, document.fileKey);

    // Delete from database
    return this.db.document.delete({ where: { id } });
  }

  async update(id: number, file: Express.Multer.File | undefined, dto: any, userId?: number, userRole?: string) {
    const existing = await this.findOne(id, userId, userRole);

    const data: any = {
      title: dto.title ?? existing.title,
      description: dto.description ?? existing.description,
      // keep existing file fields unless replaced below
    };

    if (file) {
      // upload new file
      const timestamp = Date.now();
      const fileKey = `${timestamp}-${file.originalname}`;
      await this.s3Service.uploadFile(this.BUCKET_NAME, fileKey, file.buffer, file.mimetype);

      // delete old file if exists
      if (existing.fileKey) {
        try {
          await this.s3Service.deleteFile(this.BUCKET_NAME, existing.fileKey);
        } catch (err) {
          // don't block update on S3 delete failure; log if you have a logger
        }
      }

      data.fileName = file.originalname;
      data.fileKey = fileKey;
      data.fileSize = file.size;
      data.mimeType = file.mimetype;
      data.uploadedBy = userId ?? existing.uploadedBy;
    }

    return this.db.document.update({ where: { id }, data });
  }
}