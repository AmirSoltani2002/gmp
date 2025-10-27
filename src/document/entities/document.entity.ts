export class Document {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  companyId?: number;
  createdAt: Date;
  updatedAt: Date;
}