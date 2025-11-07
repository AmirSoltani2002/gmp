import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePqrSectionDto } from './dto/create-pqr-section.dto';
import { UpdatePqrSectionDto } from './dto/update-pqr-section.dto';
import { FindAllPqrSectionDto } from './dto/find-all-pqr-section.dto';

@Injectable()
export class PqrSectionService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreatePqrSectionDto) {
    return this.db.pqrSection.create({
      data,
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.db.pqrSection.findUniqueOrThrow({
      where: { id },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(id: number, data: UpdatePqrSectionDto) {
    return this.db.pqrSection.update({
      where: { id },
      data,
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(id: number) {
    return this.db.pqrSection.delete({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async findAll(query: FindAllPqrSectionDto) {
    const {
      page = 1,
      pageSize = 20,
      limit,
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
        { titleFa: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Conditional includes based on page size
    const include =
      actualLimit < 50
        ? {
            items: true,
          }
        : undefined;

    const [items, totalItems] = await this.db.$transaction([
      this.db.pqrSection.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { order: 'asc' },
      }),
      this.db.pqrSection.count({ where }),
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
}
