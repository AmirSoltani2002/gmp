import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { FindAllRequest126Dto } from './dto/find-all-request126.dto';

@Injectable()
export class Request126Service {
  constructor(private readonly db: DatabaseService) {}

  async create(createRequest126Dto: CreateRequest126Dto) {
    const data = {
      ...createRequest126Dto,
      closedAt: createRequest126Dto.closedAt ? new Date(createRequest126Dto.closedAt) : null,
    };

    return this.db.request126.create({
      data,
      include: { 
        company: true, 
        line: true, 
        drug: true 
      },
    });
  }

  async findAll(query: FindAllRequest126Dto) {
    const {
      page = 1,
      pageSize = 20,
      limit,
      type,
      companyId,
      q,
      search,
    } = query;

    // Use pageSize if provided, otherwise fallback to limit, then default
    const actualLimit = pageSize || limit || 20;
    const skip = (page - 1) * actualLimit;

    const where: any = {};

    // Build search conditions similar to company service (use q or search)
    const searchTerm = q || search;
    if (searchTerm) {
      where.OR = [
        { type: { contains: searchTerm, mode: 'insensitive' } },
        { company: { nameFa: { contains: searchTerm, mode: 'insensitive' } } },
        { company: { nameEn: { contains: searchTerm, mode: 'insensitive' } } },
        { drug: { drugIndexName: { contains: searchTerm, mode: 'insensitive' } } },
        { drug: { genericName: { contains: searchTerm, mode: 'insensitive' } } },
        { line: { nameEn: { contains: searchTerm, mode: 'insensitive' } } },
        { line: { nameFa: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    // Specific filters (will override OR search if both provided)
    if (type && !searchTerm) {
      where.type = { contains: type, mode: 'insensitive' };
    }
    if (companyId) {
      where.companyId = companyId;
    }

    // Default filter for non-closed requests (matching original @Crud config)
    where.closedAt = null;

    // Conditional includes based on page size (like company service)
    const include =
      actualLimit < 50
        ? {
            company: true,
            line: true,
            drug: true,
            history: {
              include: {
                actor: true,
                toAssignee: true,
              },
            },
          }
        : {
            company: true,
            line: true,
            drug: true,
          };

    const [items, totalItems] = await this.db.$transaction([
      this.db.request126.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { createdAt: 'desc' }, // Matching original sort config
      }),
      this.db.request126.count({ where }),
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

  async findOne(id: number) {
    return this.db.request126.findUniqueOrThrow({
      where: { id },
      include: { 
        company: true, 
        line: true, 
        drug: true,
        history: {
          include: {
            actor: true,
            toAssignee: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async update(id: number, updateRequest126Dto: UpdateRequest126Dto) {
    const data = {
      ...updateRequest126Dto,
      closedAt: updateRequest126Dto.closedAt ? new Date(updateRequest126Dto.closedAt) : undefined,
    };

    return this.db.request126.update({
      where: { id },
      data,
      include: { 
        company: true, 
        line: true, 
        drug: true 
      },
    });
  }

  async remove(id: number) {
    return this.db.request126.delete({
      where: { id },
      include: { 
        company: true, 
        line: true, 
        drug: true 
      },
    });
  }
}
