import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { FindAllRequest126Dto } from './dto/find-all-request126.dto';

@Injectable()
export class Request126Service {
  constructor(private prisma: DatabaseService) {}

  async findMany(query?: any) {
    return this.prisma.request126.findMany({
      ...query,
      include: { company: true, line: true, drug: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.request126.findUnique({
      where: { id },
      include: { company: true, line: true, drug: true },
    });
  }

  async create(data: CreateRequest126Dto) {
    return this.prisma.request126.create({
      data,
      include: { company: true, line: true, drug: true },
    });
  }

  async update(id: number, data: UpdateRequest126Dto) {
    return this.prisma.request126.update({
      where: { id },
      data,
      include: { company: true, line: true, drug: true },
    });
  }

  async delete(id: number) {
    return this.prisma.request126.delete({ 
      where: { id },
      include: { company: true, line: true, drug: true },
    });
  }

  async findAll(query: FindAllRequest126Dto) {
    const { page = 1, pageSize = 20, limit, type, companyId, q, search } = query;
    
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
        { drug: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { line: { name: { contains: searchTerm, mode: 'insensitive' } } }
      ];
    }
    
    // Specific filters (will override OR search if both provided)
    if (type && !searchTerm) where.type = { contains: type, mode: 'insensitive' };
    if (companyId) where.companyId = companyId;
    
    // Default filter for non-closed requests
    where.closedAt = null;

    // Conditional includes based on page size (like company service)
    const include = actualLimit < 50 
      ? {
          company: true,
          line: true,
          drug: true,
          history: true
        }
      : {
          company: true,
          line: true,
          drug: true
        };

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.request126.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.request126.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / actualLimit);

    return {
      data: items,
      totalItems,
      totalPages,
      currentPage: +page,
      pageSize: +actualLimit
    };
  }

  // Alias methods for backward compatibility
  async remove(id: number) {
    return this.delete(id);
  }
}
