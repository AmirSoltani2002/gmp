export class PqrItem {
  id: number;
  sectionId: number;
  questionFa: string;
  order: number;
  
  // Relations
  section?: any;
  answers?: any[];
}
