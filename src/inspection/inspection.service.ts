import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FindAllInspectionDto } from './dto/find-all-inspection.dto';

@Injectable()
export class InspectionService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateInspectionDto) {
    return this.db.inspection.create({
      data,
      include: {
        company: true,
        line: true,
        inspectors: {
          include: {
            person: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.db.inspection.findUniqueOrThrow({
      where: { id },
      include: {
        company: true,
        line: true,
        inspectors: {
          include: {
            person: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateInspectionDto) {
    return this.db.inspection.update({
      where: { id },
      data,
      include: {
        company: true,
        line: true,
        inspectors: {
          include: {
            person: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.db.inspection.delete({
      where: { id },
      include: {
        company: true,
        line: true,
        inspectors: {
          include: {
            person: true,
          },
        },
      },
    });
  }

  async findAll(query: FindAllInspectionDto) {
    const {
      page = 1,
      pageSize = 20,
      limit,
      companyId,
      lineId,
      q,
      search,
    } = query;

    const actualLimit = pageSize || limit || 20;
    const skip = (page - 1) * actualLimit;

    const where: any = {};

    // Multi-field search
    const searchTerm = q || search;
    if (searchTerm) {
      where.OR = [
        { company: { nameFa: { contains: searchTerm, mode: 'insensitive' } } },
        { company: { nameEn: { contains: searchTerm, mode: 'insensitive' } } },
        { line: { nameFa: { contains: searchTerm, mode: 'insensitive' } } },
        { line: { nameEn: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    // Specific filters
    if (companyId && !searchTerm) where.companyId = companyId;
    if (lineId && !searchTerm) where.lineId = lineId;

    // Conditional includes based on page size
    const include =
      actualLimit < 50
        ? {
            company: true,
            line: true,
            inspectors: {
              include: {
                person: true,
              },
            },
          }
        : {
            company: true,
            line: true,
          };

    const [items, totalItems] = await this.db.$transaction([
      this.db.inspection.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.inspection.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / actualLimit);

    return {
      data: items,
      totalItems,
      totalPages,
      currentPage: +page,
      pageSize: +actualLimit,
    };
  }

  async findByCompany(companyId: number) {
    return this.db.inspection.findMany({
      where: { companyId },
      include: {
        company: true,
        line: true,
        inspectors: {
          include: {
            person: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLine(lineId: number) {
    return this.db.inspection.findMany({
      where: { lineId },
      include: {
        company: true,
        line: true,
        inspectors: {
          include: {
            person: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
