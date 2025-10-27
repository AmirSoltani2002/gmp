import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DocumentS3Service } from '../s3/document.s3.service';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';
import { UpdateMedicalReportDto } from './dto/update-medical-report.dto';
import { FindAllMedicalReportDto } from './dto/find-all-medical-report.dto';

@Injectable()
export class MedicalReportService {
  private readonly BUCKET_NAME = process.env.AWS_S3_BUCKET || 'gmp-documents';

  constructor(
    private readonly db: DatabaseService,
    private readonly s3Service: DocumentS3Service,
  ) {}

  /**
   * Create a quick report and optionally upload an image to S3.
   */
  async create(
    file: Express.Multer.File | undefined,
    dto: CreateMedicalReportDto,
    ip: string,
  ) {
    let productImageKey: string | undefined = undefined;

    if (file) {
      const timestamp = Date.now();
      productImageKey = `${timestamp}-${file.originalname}`;
      await this.s3Service.uploadFile(
        this.BUCKET_NAME,
        productImageKey,
        file.buffer,
        file.mimetype,
      );
    }

    return this.db.quickReport.create({
      data: {
        drugBrandName: dto.drugBrandName,
        companyName: dto.companyName,
        batchNumber: dto.batchNumber,
        description: dto.description,
        phoneNumber: dto.phoneNumber,
        email: dto.email,
        ip: ip,
        userAgent: dto.userAgent,
        patientName: dto.patientName,
        patientAge: dto.patientAge,
        patientGender: dto.patientGender as any,
        drugGenericName: dto.drugGenericName,
        dosageForm: dto.dosageForm,
        dosageStrength: dto.dosageStrength,
        gtin: dto.gtin,
        uid: dto.uid,
        productionDate: dto.productionDate ? new Date(dto.productionDate) : undefined,
        expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : undefined,
        consumptionDate: dto.consumptionDate ? new Date(dto.consumptionDate) : undefined,
        purchaseLocation: dto.purchaseLocation,
        storageDescription: dto.storageDescription,
        defectTypes: dto.defectTypes,
        defectDetails: dto.defectDetails,
        productImageKey,
        metadata: dto.metadata,
      },
    });
  }

  async findAll(query: FindAllMedicalReportDto) {
    const { page = 1, pageSize = 20, q } = query as any;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (q) {
      where.OR = [
        { drugBrandName: { contains: q, mode: 'insensitive' } },
        { companyName: { contains: q, mode: 'insensitive' } },
        { batchNumber: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, totalItems] = await this.db.$transaction([
      this.db.quickReport.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.db.quickReport.count({ where }),
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

  async findOne(id: string) {
    const item = await this.db.quickReport.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Medical report not found');
    return item;
  }

  async getDownloadUrl(id: string) {
    const item = await this.findOne(id);
    if (!item.productImageKey) throw new NotFoundException('No image for this report');
    return this.s3Service.getPresignedUrl(this.BUCKET_NAME, item.productImageKey);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    if (item.productImageKey) {
      await this.s3Service.deleteFile(this.BUCKET_NAME, item.productImageKey);
    }

    return this.db.quickReport.delete({ where: { id } });
  }

  async update(id: string, dto: UpdateMedicalReportDto) {
    await this.findOne(id);
    return this.db.quickReport.update({ where: { id }, data: dto as any });
  }
}
