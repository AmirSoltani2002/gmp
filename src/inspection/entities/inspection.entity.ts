export class Inspection {
  id: number;
  companyId: number;
  lineId: number;
  critical: number;
  major: number;
  minor: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  company?: any;
  line?: any;
  inspectors?: any[];
}
