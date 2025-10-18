export class Request126 {
  id: number;
  type: string;
  companyId: number;
  lineId: number;
  drugId: number;
  drugOEB_declared: number;
  drugOEL_declared: number;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (for @nestjsx/crud joins)
  company?: any;
  line?: any;
  drug?: any;
  history?: any[];
}
