import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { FindAllRequest126Dto } from './dto/find-all-request126.dto';

@Injectable()
export class Request126Service {
  constructor(private prisma: DatabaseService) {}

  async findAll(query: FindAllRequest126Dto) {
    const { page = 1, limit = 20, type, companyId, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = { contains: type, mode: 'insensitive' };
    if (companyId) where.companyId = companyId;
    if (search) where.type = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.request126.findMany({
        where,
        skip,
        take: limit,
        include: { company: true, line: true, drug: true },
      }),
      this.prisma.request126.count({ where }),
    ]);

    return {
      results: items,
      count: total,
      next:
        skip + limit < total
          ? `/api/request126?page=${page + 1}&limit=${limit}`
          : null,
      previous:
        page > 1 ? `/api/request126?page=${page - 1}&limit=${limit}` : null,
    };
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

  async remove(id: number) {
    return this.prisma.request126.delete({ where: { id } });
  }
}
