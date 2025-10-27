import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DocumentS3Service } from '../s3/document.s3.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { FindAllDocumentDto } from './dto/find-all-document.dto';
import { DocumentPermission } from './document.permissions';
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
    companyId?: number,
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
        companyId: companyId,
      },
    });
  }

  async findAll(query: FindAllDocumentDto, person: any) {
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

    const userCompanyId = person.companies?.[0]?.company?.id;
    const userRole = person.role as ROLES;

    // Filter by company for roles that can't access other companies
    if (userRole === ROLES.CEO || userRole === ROLES.COMPANYOTHER) {
      where.companyId = userCompanyId;
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

    // For QRP, restrict documents from other companies to title only
    const processedItems = items.map(item => {
      if (userRole === ROLES.QRP && item.companyId !== userCompanyId) {
        return { title: item.title };
      }
      return item;
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: processedItems,
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
    };
  }

  async findOne(id: number, givenCompanyId?: number, person?: any) {
    const document = await this.db.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // Check permissions
    const accessResult = await DocumentPermission.canAccessRestrictedEntity(person, document.companyId);
    if (!accessResult.canAccess) {
      throw new ForbiddenException(accessResult.message || 'Access denied');
    }

    if (accessResult.isRestricted) {
      return { title: document.title };
    }

    return document;
  }

  async getDownloadUrl(id: number, companyId: number, person: any) {
    const document = await this.findOne(id, companyId, person)
    if (!('fileKey' in document)) throw new NotFoundException('Document not found or you dont have access.');

    return this.s3Service.getPresignedUrl(this.BUCKET_NAME, document.fileKey);
  }

  async remove(id: number, companyId?: number, person?: any) {
    const document = await this.findOne(id, companyId, person)
    if (!('fileKey' in document)) throw new NotFoundException('Document not found or you dont have access.');

    // Delete from S3
    await this.s3Service.deleteFile(this.BUCKET_NAME, document.fileKey);

    // Delete from database
    return this.db.document.delete({ where: { id } });
  }

  async update(id: number, file: Express.Multer.File | undefined, dto: any, companyId: number, person: any) {
    const existing = await this.findOne(id, companyId, person);
    if (!('fileKey' in existing)) throw new NotFoundException('Document not found or you dont have access.');

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
      data.companyId = companyId ?? existing.companyId;
    }

    return this.db.document.update({ where: { id }, data });
  }
}