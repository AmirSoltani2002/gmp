import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePqrItemDto } from './dto/create-pqr-item.dto';
import { UpdatePqrItemDto } from './dto/update-pqr-item.dto';
import { FindAllPqrItemDto } from './dto/find-all-pqr-item.dto';

@Injectable()
export class PqrItemService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreatePqrItemDto) {
    return this.db.pqrItem.create({
      data,
      include: {
        section: true,
        answers: true,
      },
    });
  }

  async findOne(id: number) {
    return this.db.pqrItem.findUniqueOrThrow({
      where: { id },
      include: {
        section: true,
        answers: true,
      },
    });
  }

  async update(id: number, data: UpdatePqrItemDto) {
    return this.db.pqrItem.update({
      where: { id },
      data,
      include: {
        section: true,
        answers: true,
      },
    });
  }

  async remove(id: number) {
    return this.db.pqrItem.delete({
      where: { id },
      include: {
        section: true,
        answers: true,
      },
    });
  }

  async findAll(query: FindAllPqrItemDto) {
    const {
      page = 1,
      pageSize = 20,
      limit,
      sectionId,
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
        { questionFa: { contains: searchTerm, mode: 'insensitive' } },
        { section: { titleFa: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    // Specific filters
    if (sectionId && !searchTerm) where.sectionId = sectionId;

    // Conditional includes based on page size
    const include =
      actualLimit < 50
        ? {
            section: true,
            answers: true,
          }
        : {
            section: true,
          };

    const [items, totalItems] = await this.db.$transaction([
      this.db.pqrItem.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: [{ sectionId: 'asc' }, { order: 'asc' }],
      }),
      this.db.pqrItem.count({ where }),
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

  async findBySection(sectionId: number) {
    return this.db.pqrItem.findMany({
      where: { sectionId },
      include: {
        section: true,
        answers: true,
      },
      orderBy: { order: 'asc' },
    });
  }
}
