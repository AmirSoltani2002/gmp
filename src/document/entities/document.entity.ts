export class Document {
  id: number;
  title: string;
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  uploadedBy?: number;
  createdAt: Date;
  updatedAt: Date;
}