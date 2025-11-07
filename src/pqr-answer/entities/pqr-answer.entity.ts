export class PqrAnswer {
  id: number;
  formId: number;
  itemId: number;
  answer: string | null;
  details: string | null;
  
  // Relations
  item?: any;
}
