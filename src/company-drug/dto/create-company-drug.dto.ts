import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
  
export class CreateCompanyDrugDto {
    @IsInt()
    @IsNotEmpty()
    drugId: number;
  
    @IsInt()
    @IsNotEmpty()
    brandOwnerId: number;
  
    @IsString()
    @IsNotEmpty()
    IRC: string;

    @IsString()
    @IsOptional()
    GTIN?: string;
  
    @IsString()
    @IsNotEmpty()
    brandNameEn: string;
  
    @IsString()
    @IsOptional()
    brandNameFa?: string;
  
    @IsNumber()
    @IsOptional()
    packageCount?: number;
  
    @IsBoolean()
    @IsOptional()
    isBulk?: boolean;
  
    @IsBoolean()
    @IsOptional()
    isTemp?: boolean;
  
    @IsString()
    @IsNotEmpty()
    status: string;
  
    @IsInt()
    @IsNotEmpty()
    supplierId: number;
  
    @IsInt()
    @IsOptional()
    producerId?: number;

    @IsInt()
    @IsOptional()
    lineId?: number;
  }