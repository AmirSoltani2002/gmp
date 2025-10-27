import { IsString, IsOptional, IsInt, IsEmail, IsEnum, IsDateString, IsIP, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PatientGender {
  male = 'male',
  female = 'female',
}

export class CreateMedicalReportDto {
  @ApiProperty({ description: 'Drug brand name' })
  @IsString()
  drugBrandName: string;

  @ApiProperty({ description: 'Company name' })
  @IsString()
  companyName: string;

  @ApiProperty({ description: 'Batch number' })
  @IsString()
  batchNumber: string;

  @ApiProperty({ description: 'Description of the report' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Ip' })
  @IsOptional()
  @IsIP()
  ip?: string;

  @ApiPropertyOptional({ description: 'User Agent' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Patient name' })
  @IsOptional()
  @IsString()
  patientName?: string;

  @ApiPropertyOptional({ description: 'Patient age' })
  @IsOptional()
  @IsInt()
  patientAge?: number;

  @ApiPropertyOptional({ description: 'Patient gender', enum: PatientGender })
  @IsOptional()
  @IsEnum(PatientGender)
  patientGender?: PatientGender;

  @ApiPropertyOptional({ description: 'Drug generic name' })
  @IsOptional()
  @IsString()
  drugGenericName?: string;

  @ApiPropertyOptional({ description: 'Dosage form' })
  @IsOptional()
  @IsString()
  dosageForm?: string;

  @ApiPropertyOptional({ description: 'Dosage strength' })
  @IsOptional()
  @IsString()
  dosageStrength?: string;

  @ApiPropertyOptional({ description: 'GTIN' })
  @IsOptional()
  @IsString()
  gtin?: string;

  @ApiPropertyOptional({ description: 'UID' })
  @IsOptional()
  @IsString()
  uid?: string;

  @ApiPropertyOptional({ description: 'Production date (ISO string)' })
  @IsOptional()
  @IsDateString()
  productionDate?: string;

  @ApiPropertyOptional({ description: 'Expiration date (ISO string)' })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;
  
  @ApiPropertyOptional({ description: 'Consumption date (ISO string)' })
  @IsOptional()
  @IsDateString()
  consumptionDate?: string;

  @ApiPropertyOptional({ description: 'Purchase location' })
  @IsOptional()
  @IsString()
  purchaseLocation?: string;

  @ApiPropertyOptional({ description: 'Storage description' })
  @IsOptional()
  @IsString()
  storageDescription?: string;

  @ApiPropertyOptional({
    description: 'Defect types (as comma-separated string)',
  })
  @IsOptional()
  @IsString()
  defectTypes?: string;

  @ApiPropertyOptional({ description: 'Defect details' })
  @IsOptional()
  @IsString()
  defectDetails?: string;

  @ApiPropertyOptional({ description: 'Optional JSON metadata' })
  @IsOptional()
  metadata?: any;
}
