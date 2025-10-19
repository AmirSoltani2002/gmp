export class Request126History {
  id: number;
  requestId: number;
  actorId: number;
  action: string;
  fromStatus: string;
  toStatus: string;
  toAssigneeId: number;
  message?: string;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (for Prisma includes)
  request?: any;
  actor?: any;
  toAssignee?: any;
}