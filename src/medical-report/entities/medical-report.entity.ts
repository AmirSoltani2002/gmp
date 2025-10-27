export class MedicalReport {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Required
  drugBrandName: string;
  companyName: string;
  batchNumber: string;
  description: string;

  // info
  phoneNumber?: string;
  email?: string;
  ip?: string;
  userAgent?: string;

  // Optional - patient info
  patientName?: string;
  patientAge?: number;
  patientGender?: 'male' | 'female';

  // Optional - drug extended info
  drugGenericName?: string;
  dosageForm?: string;
  dosageStrength?: string;
  gtin?: string;
  uid?: string;
  productionDate?: Date;
  expirationDate?: Date;

  // Optional - where and how purchased/stored
  purchaseLocation?: string;
  storageDescription?: string;

  // Optional - defect types
  defectTypes?: string;
  defectDetails?: string;

  // Optional image file uploaded to S3
  productImageKey?: string;

  metadata?: any;
}
