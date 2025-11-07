export class InspectionInspector {
  id: number;
  inspectionId: number;
  personId: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  inspection?: any;
  person?: any;
}
