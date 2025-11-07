import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateInspectionInspectorDto } from './dto/create-inspection-inspector.dto';
import { UpdateInspectionInspectorDto } from './dto/update-inspection-inspector.dto';
import { FindAllInspectionInspectorDto } from './dto/find-all-inspection-inspector.dto';

@Injectable()
export class InspectionInspectorService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateInspectionInspectorDto) {
    return this.db.inspectionInspector.create({
      data,
      include: {
        inspection: {
          include: {
            company: true,
            line: true,
          },
        },
        person: true,
      },
    });
  }

  async findOne(id: number) {
    return this.db.inspectionInspector.findUniqueOrThrow({
      where: { id },
      include: {
        inspection: {
          include: {
            company: true,
            line: true,
          },
        },
        person: true,
      },
    });
  }

  async update(id: number, data: UpdateInspectionInspectorDto) {
    return this.db.inspectionInspector.update({
      where: { id },
      data,
      include: {
        inspection: {
          include: {
            company: true,
            line: true,
          },
        },
        person: true,
      },
    });
  }

  async remove(id: number) {
    return this.db.inspectionInspector.delete({
      where: { id },
      include: {
        inspection: {
          include: {
            company: true,
            line: true,
          },
        },
        person: true,
      },
    });
  }

  async findAll(query: FindAllInspectionInspectorDto) {
    const {
      page = 1,
      pageSize = 20,
      limit,
      inspectionId,
      personId,
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
        { person: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { person: { familyName: { contains: searchTerm, mode: 'insensitive' } } },
        { person: { username: { contains: searchTerm, mode: 'insensitive' } } },
        { inspection: { company: { nameFa: { contains: searchTerm, mode: 'insensitive' } } } },
        { inspection: { company: { nameEn: { contains: searchTerm, mode: 'insensitive' } } } },
      ];
    }

    // Specific filters
    if (inspectionId && !searchTerm) where.inspectionId = inspectionId;
    if (personId && !searchTerm) where.personId = personId;

    // Conditional includes based on page size
    const include =
      actualLimit < 50
        ? {
            inspection: {
              include: {
                company: true,
                line: true,
              },
            },
            person: true,
          }
        : {
            inspection: true,
            person: true,
          };

    const [items, totalItems] = await this.db.$transaction([
      this.db.inspectionInspector.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.inspectionInspector.count({ where }),
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

  async findByInspection(inspectionId: number) {
    return this.db.inspectionInspector.findMany({
      where: { inspectionId },
      include: {
        inspection: {
          include: {
            company: true,
            line: true,
          },
        },
        person: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPerson(personId: number) {
    return this.db.inspectionInspector.findMany({
      where: { personId },
      include: {
        inspection: {
          include: {
            company: true,
            line: true,
          },
        },
        person: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
