import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePqrAnswerDto } from './dto/create-pqr-answer.dto';
import { UpdatePqrAnswerDto } from './dto/update-pqr-answer.dto';
import { FindAllPqrAnswerDto } from './dto/find-all-pqr-answer.dto';

@Injectable()
export class PqrAnswerService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreatePqrAnswerDto) {
    return this.db.pqrAnswer.create({
      data,
      include: {
        item: {
          include: {
            section: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.db.pqrAnswer.findUniqueOrThrow({
      where: { id },
      include: {
        item: {
          include: {
            section: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdatePqrAnswerDto) {
    return this.db.pqrAnswer.update({
      where: { id },
      data,
      include: {
        item: {
          include: {
            section: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.db.pqrAnswer.delete({
      where: { id },
      include: {
        item: true,
      },
    });
  }

  async findAll(query: FindAllPqrAnswerDto) {
    const {
      page = 1,
      pageSize = 20,
      limit,
      formId,
      itemId,
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
        { answer: { contains: searchTerm, mode: 'insensitive' } },
        { details: { contains: searchTerm, mode: 'insensitive' } },
        { item: { questionFa: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    // Specific filters
    if (formId && !searchTerm) where.formId = formId;
    if (itemId && !searchTerm) where.itemId = itemId;

    // Conditional includes based on page size
    const include =
      actualLimit < 50
        ? {
            item: {
              include: {
                section: true,
              },
            },
          }
        : {
            item: true,
          };

    const [items, totalItems] = await this.db.$transaction([
      this.db.pqrAnswer.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { id: 'asc' },
      }),
      this.db.pqrAnswer.count({ where }),
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

  async findByForm(formId: number) {
    return this.db.pqrAnswer.findMany({
      where: { formId },
      include: {
        item: {
          include: {
            section: true,
          },
        },
      },
      orderBy: { itemId: 'asc' },
    });
  }

  async findByItem(itemId: number) {
    return this.db.pqrAnswer.findMany({
      where: { itemId },
      include: {
        item: {
          include: {
            section: true,
          },
        },
      },
      orderBy: { formId: 'asc' },
    });
  }
}
