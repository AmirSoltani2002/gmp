import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRequest126HistoryDto } from './dto/create-request126-history.dto';
import { UpdateRequest126HistoryDto } from './dto/update-request126-history.dto';
import { FindAllRequest126HistoryDto } from './dto/find-all-request126-history.dto';

@Injectable()
export class Request126HistoryService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateRequest126HistoryDto) {
    return this.db.request126History.create({
      data: {
        requestId: data.requestId,
        actorId: data.actorId,
        action: data.action as any,
        fromStatus: data.fromStatus as any,
        toStatus: data.toStatus as any,
        toAssigneeId: data.toAssigneeId,
        message: data.message,
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
    const [items, totalItems] = await this.db.$transaction([
      this.db.request126History.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.db.request126History.count({ where }),
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

  async findOne(id: number) {
    return this.db.request126History.findUniqueOrThrow({
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

  async update(id: number, data: UpdateRequest126HistoryDto) {
    const updateData: any = {};
    if (data.action !== undefined) updateData.action = data.action;
    if (data.fromStatus !== undefined) updateData.fromStatus = data.fromStatus;
    if (data.toStatus !== undefined) updateData.toStatus = data.toStatus;
    if (data.message !== undefined) updateData.message = data.message;
    if (data.endedAt !== undefined) updateData.endedAt = data.endedAt ? new Date(data.endedAt) : null;
    
    return this.db.request126History.update({
      where: { id },
      data: updateData,
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

  async remove(id: number) {
    return this.db.request126History.delete({ 
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

  // 🔸 Utility methods for custom endpoints
  async findByRequest(requestId: number) {
    return this.db.request126History.findMany({
      where: { requestId },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByActor(actorId: number) {
    return this.db.request126History.findMany({
      where: { actorId },
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
      orderBy: { createdAt: 'desc' },
    });
  }
}