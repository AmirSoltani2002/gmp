import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { FindAllRequest126Dto } from './dto/find-all-request126.dto';
import { AssignRequest126Dto } from './dto/assign-request126.dto';
import { ROLES } from '../common/interface';

@Injectable()
export class Request126Service {
  constructor(private readonly db: DatabaseService) {}

  async createWithHistory(createRequest126Dto: CreateRequest126Dto, actor: any) {
    
    return this.db.$transaction(async (tx) => {
      const request = await tx.request126.create({
        data: createRequest126Dto,
        include: {
          company: true,
          line: true,
          drug: true,
        },
      });

      const actorId: number = actor?.id;
      if (!actorId) {
        throw new BadRequestException('Invalid actor');
      }

      // Only QRP can create; assign to a company user (COMPANYOTHER) of this request's company
      const actorRole: ROLES | string = actor?.role;
      if (actorRole !== ROLES.QRP && actorRole !== ROLES.SYSTEM) {
        throw new BadRequestException('Only QRP and SYSTEM can create requests');
      }

      const ifdaManager = await tx.person.findFirst({
        where: {
          role: ROLES.IFDAMANAGER,
        },
      });
      const toAssigneeId: number | null = ifdaManager?.id ?? null;

      if (!toAssigneeId) {
        throw new BadRequestException('No suitable assignee found for initial draft');
      }

      await tx.request126History.create({
        data: {
          requestId: request.id,
          actorId,
          action: 'create',
          fromStatus: 'nowhere',
          toStatus: 'draft',
          toAssigneeId,
          message: 'Request created; status set to draft.',
        },
      });

      return request;
    });
  }

  async create(createRequest126Dto: CreateRequest126Dto) {
    return this.db.request126.create({
      data: createRequest126Dto,
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

  async update(id: number, updateRequest126Dto: UpdateRequest126Dto, actor?: any) {
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

  async submit(id: number, actor: any) {
    const actorId: number = actor?.id;
    if (!actorId) {
      throw new BadRequestException('Invalid actor');
    }

    // Only QRP can submit requests
    const actorRole: ROLES | string = actor?.role;
    if (actorRole !== ROLES.QRP) {
      throw new BadRequestException('Only QRP can submit requests');
    }

    return this.db.$transaction(async (tx) => {
      // Get the last history entry to check current status
      const lastHistory = await tx.request126History.findFirst({
        where: { requestId: id },
        orderBy: { createdAt: 'desc' },
      });

      if (!lastHistory) {
        throw new BadRequestException('No history found for request');
      }

      const currentStatus = lastHistory.toStatus;
      if (currentStatus !== 'draft') {
        throw new BadRequestException(`Request cannot be submitted. Current status is ${currentStatus}, expected draft.`);
      }

      // Get the request to ensure it exists
      const request = await tx.request126.findUniqueOrThrow({
        where: { id },
        include: {
          company: true,
          line: true,
          drug: true,
        },
      });

      // Determine next status: draft -> pendingAssign
      const nextStatus = 'pendingAssign';

      // Keep the same assignee
      const toAssigneeId = lastHistory.toAssigneeId;

      if (!toAssigneeId) {
        throw new BadRequestException('No assignee found for request submission');
      }

      // Create history entry for submission
      await tx.request126History.create({
        data: {
          requestId: id,
          actorId,
          action: 'submit',
          fromStatus: currentStatus as any,
          toStatus: nextStatus as any,
          toAssigneeId,
          message: 'Request submitted from draft to pending assignment.',
          endedAt: null,
        },
      });

      return request;
    });
  }

  async assign(id: number, assignRequest126Dto: AssignRequest126Dto, actor: any) {
    const actorId: number = actor?.id;
    if (!actorId) {
      throw new BadRequestException('Invalid actor');
    }

    // Only IFDAMANAGER can assign requests to IFDA users
    const actorRole: ROLES | string = actor?.role;
    if (actorRole !== ROLES.IFDAMANAGER && actorRole !== ROLES.SYSTEM) {
      throw new BadRequestException('Only IFDAMANAGER can assign requests');
    }

    return this.db.$transaction(async (tx) => {
      // Verify the person exists and is an IFDA user (not manager)
      const assignee = await tx.person.findUnique({
        where: { id: assignRequest126Dto.personId },
      });

      if (!assignee) {
        throw new BadRequestException('Assignee person not found');
      }

      if (assignee.role !== ROLES.IFDAUSER) {
        throw new BadRequestException('Can only assign to IFDA users');
      }

      // Get the request to ensure it exists
      const request = await tx.request126.findUniqueOrThrow({
        where: { id },
        include: {
          company: true,
          line: true,
          drug: true,
        },
      });

      // Get the last history entry to determine current status
      const lastHistory = await tx.request126History.findFirst({
        where: { requestId: id },
        orderBy: { createdAt: 'desc' },
      });

      if (!lastHistory) {
        throw new BadRequestException('No history found for request');
      }

      const currentStatus = lastHistory.toStatus;
      if (currentStatus !== 'pendingAssign') {
        throw new BadRequestException(`Request must be in pendingAssign status to assign. Current status: ${currentStatus}`);
      }

      // Status changes to pendingReview when assigned to IFDA user
      const toStatus = 'pendingReview';

      // Create history entry for assignment
      await tx.request126History.create({
        data: {
          requestId: id,
          actorId,
          action: 'assign',
          fromStatus: currentStatus as any,
          toStatus: toStatus as any,
          toAssigneeId: assignRequest126Dto.personId,
          message: `Request assigned to IFDA user ${assignee.name || assignee.username} for review.`,
          endedAt: null,
        },
      });

      return request;
    });
  }

  async sendBackToManager(id: number, actor: any, message?: string) {
    const actorId: number = actor?.id;
    if (!actorId) {
      throw new BadRequestException('Invalid actor');
    }

    // Only IFDAUSER can send back to manager
    const actorRole: ROLES | string = actor?.role;
    if (actorRole !== ROLES.IFDAUSER && actorRole !== ROLES.SYSTEM) {
      throw new BadRequestException('Only IFDAUSER can send request back to manager');
    }

    return this.db.$transaction(async (tx) => {
      // Get the request to ensure it exists
      const request = await tx.request126.findUniqueOrThrow({
        where: { id },
        include: {
          company: true,
          line: true,
          drug: true,
        },
      });

      // Get the last history entry
      const lastHistory = await tx.request126History.findFirst({
        where: { requestId: id },
        orderBy: { createdAt: 'desc' },
      });

      if (!lastHistory) {
        throw new BadRequestException('No history found for request');
      }

      const currentStatus = lastHistory.toStatus;
      if (currentStatus !== 'pendingReview') {
        throw new BadRequestException(`Request must be in pendingReview status. Current status: ${currentStatus}`);
      }

      // Verify the actor is the current assignee
      if (lastHistory.toAssigneeId !== actorId && actorRole !== ROLES.SYSTEM) {
        throw new BadRequestException('Only the assigned IFDA user can send this request back');
      }

      // Find the manager who originally assigned this (or find any IFDA manager)
      // Look for the first assign action by a manager
      const managerAssignment = await tx.request126History.findFirst({
        where: {
          requestId: id,
          action: 'assign',
        },
        include: {
          actor: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      let managerId: number | null = null;

      // If we found a manager assignment, use that manager
      if (managerAssignment && managerAssignment.actor.role === ROLES.IFDAMANAGER) {
        managerId = managerAssignment.actorId;
      } else {
        // Fallback: find any IFDA manager
        const manager = await tx.person.findFirst({
          where: { role: ROLES.IFDAMANAGER },
        });
        managerId = manager?.id ?? null;
      }

      if (!managerId) {
        throw new BadRequestException('No manager found to assign the request to');
      }

      // Status changes back to pendingAssign and assigned to manager
      const toStatus = 'pendingDecision';

      // Use provided message or default message
      const finalMessage = message || 'Request sent back to manager for final decision.';

      // Create history entry
      await tx.request126History.create({
        data: {
          requestId: id,
          actorId,
          action: 'review',
          fromStatus: currentStatus as any,
          toStatus: toStatus as any,
          toAssigneeId: managerId,
          message: finalMessage,
          endedAt: null,
        },
      });

      return request;
    });
  }

  async approve(id: number, actor: any) {
    const actorId: number = actor?.id;
    if (!actorId) {
      throw new BadRequestException('Invalid actor');
    }

    // Only IFDAMANAGER can approve
    const actorRole: ROLES | string = actor?.role;
    if (actorRole !== ROLES.IFDAMANAGER && actorRole !== ROLES.SYSTEM) {
      throw new BadRequestException('Only IFDAMANAGER can approve requests');
    }

    return this.db.$transaction(async (tx) => {
      // Get the request to ensure it exists
      const request = await tx.request126.findUniqueOrThrow({
        where: { id },
        include: {
          company: true,
          line: true,
          drug: true,
        },
      });

      // Get the last history entry
      const lastHistory = await tx.request126History.findFirst({
        where: { requestId: id },
        orderBy: { createdAt: 'desc' },
      });

      if (!lastHistory) {
        throw new BadRequestException('No history found for request');
      }

      const currentStatus = lastHistory.toStatus;
      if (currentStatus !== 'pendingDecision') {
        throw new BadRequestException(`Request must be in pendingDecision status to approve. Current status: ${currentStatus}`);
      }

      // Verify the actor is the current assignee (manager)
      if (lastHistory.toAssigneeId !== actorId && actorRole !== ROLES.SYSTEM) {
        throw new BadRequestException('Only the assigned manager can approve this request');
      }

      const toStatus = 'approved';

      // Create history entry
      await tx.request126History.create({
        data: {
          requestId: id,
          actorId,
          action: 'approve',
          fromStatus: currentStatus as any,
          toStatus: toStatus as any,
          toAssigneeId: actorId, // Manager remains the assignee
          message: 'Request approved by manager.',
          endedAt: null,
        },
      });

      return request;
    });
  }

  async reject(id: number, actor: any) {
    const actorId: number = actor?.id;
    if (!actorId) {
      throw new BadRequestException('Invalid actor');
    }

    // Only IFDAMANAGER can reject
    const actorRole: ROLES | string = actor?.role;
    if (actorRole !== ROLES.IFDAMANAGER && actorRole !== ROLES.SYSTEM) {
      throw new BadRequestException('Only IFDAMANAGER can reject requests');
    }

    return this.db.$transaction(async (tx) => {
      // Get the request to ensure it exists
      const request = await tx.request126.findUniqueOrThrow({
        where: { id },
        include: {
          company: true,
          line: true,
          drug: true,
        },
      });

      // Get the last history entry
      const lastHistory = await tx.request126History.findFirst({
        where: { requestId: id },
        orderBy: { createdAt: 'desc' },
      });

      if (!lastHistory) {
        throw new BadRequestException('No history found for request');
      }

      const currentStatus = lastHistory.toStatus;
      if (currentStatus !== 'pendingDecision') {
        throw new BadRequestException(`Request must be in pendingDecision status to reject. Current status: ${currentStatus}`);
      }

      // Verify the actor is the current assignee (manager)
      if (lastHistory.toAssigneeId !== actorId && actorRole !== ROLES.SYSTEM) {
        throw new BadRequestException('Only the assigned manager can reject this request');
      }

      const toStatus = 'rejected';

      // Create history entry
      await tx.request126History.create({
        data: {
          requestId: id,
          actorId,
          action: 'reject',
          fromStatus: currentStatus as any,
          toStatus: toStatus as any,
          toAssigneeId: actorId, // Manager remains the assignee
          message: 'Request rejected by manager.',
          endedAt: null,
        },
      });

      return request;
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
