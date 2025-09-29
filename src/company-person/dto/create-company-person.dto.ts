import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCompanyPersonDto {
  @IsInt()
  personId: number;

  @IsInt()
  companyId: number;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsString()
  @IsOptional()
  licenseDate?: string;
}