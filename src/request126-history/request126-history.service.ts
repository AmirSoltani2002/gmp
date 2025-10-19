import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRequest126HistoryDto } from './dto/create-request126-history.dto';
import { UpdateRequest126HistoryDto } from './dto/update-request126-history.dto';
import { FindAllRequest126HistoryDto } from './dto/find-all-request126-history.dto';

@Injectable()
export class Request126HistoryService {
  constructor(private prisma: DatabaseService) {}

  // 🔸 @nestjsx/crud compatible methods
  async findMany(query?: any) {
    return this.prisma.request126History.findMany({
      ...query,
      include: { 
        request: {
          include: {
            company: true,
            line: true,
            drug: true
          }
        },
        actor: true,
        toAssignee: true
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.request126History.findUnique({
      where: { id },
      include: { 
        request: {
          include: {
            company: true,
            line: true,
            drug: true
          }
        },
        actor: true,
        toAssignee: true
      },
    });
  }

  async create(data: CreateRequest126HistoryDto) {
    return this.prisma.request126History.create({
      data: {
        ...data,
        endedAt: data.endedAt ? new Date(data.endedAt) : null,
      },
      include: { 
        request: {
          include: {
            company: true,
            line: true,
            drug: true
          }
        },
        actor: true,
        toAssignee: true
      },
    });
  }

  async update(id: number, data: UpdateRequest126HistoryDto) {
    return this.prisma.request126History.update({
      where: { id },
      data: {
        ...data,
        endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
      },
      include: { 
        request: {
          include: {
            company: true,
            line: true,
            drug: true
          }
        },
        actor: true,
        toAssignee: true
      },
    });
  }

  async delete(id: number) {
    return this.prisma.request126History.delete({ 
      where: { id },
      include: { 
        request: {
          include: {
            company: true,
            line: true,
            drug: true
          }
        },
        actor: true,
        toAssignee: true
      },
    });
  }

  // 🔸 Enhanced findAll with advanced search capabilities
  async findAll(query: FindAllRequest126HistoryDto) {
    const { 
      page = 1, 
      pageSize = 20, 
      limit, 
      requestId, 
      actorId, 
      toAssigneeId, 
      action, 
      toStatus, 
      q, 
      search 
    } = query;
    
    // Support both pageSize and limit parameters
    const actualLimit = pageSize || limit || 20;
    const skip = (page - 1) * actualLimit;

    const where: any = {};
    
    // Multi-field search
    const searchTerm = q || search;
    if (searchTerm) {
      where.OR = [
        { action: { contains: searchTerm, mode: 'insensitive' } },
        { fromStatus: { contains: searchTerm, mode: 'insensitive' } },
        { toStatus: { contains: searchTerm, mode: 'insensitive' } },
        { message: { contains: searchTerm, mode: 'insensitive' } },
        { actor: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { actor: { familyName: { contains: searchTerm, mode: 'insensitive' } } },
        { toAssignee: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { toAssignee: { familyName: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }
    
    // Specific filters (override search if both provided)
    if (requestId && !searchTerm) where.requestId = requestId;
    if (actorId && !searchTerm) where.actorId = actorId;
    if (toAssigneeId && !searchTerm) where.toAssigneeId = toAssigneeId;
    if (action && !searchTerm) where.action = { contains: action, mode: 'insensitive' };
    if (toStatus && !searchTerm) where.toStatus = { contains: toStatus, mode: 'insensitive' };

    // Performance optimization: conditional includes
    const include = actualLimit < 50 
      ? {
          request: {
            include: {
              company: true,
              line: true,
              drug: true
            }
          },
          actor: true,
          toAssignee: true
        }
      : {
          request: {
            include: {
              company: true
            }
          },
          actor: true,
          toAssignee: true
        };

    // Use transaction for consistency
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.request126History.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.request126History.count({ where }),
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

  // Alias for backward compatibility
  async remove(id: number) {
    return this.delete(id);
  }
}