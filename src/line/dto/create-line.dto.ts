import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateLineDto {
    @IsNumber()
    @Type(() => Number)
    siteId: number;
    
    @IsOptional()
    @IsString()
    nameEn?: string;
    
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    capacity?: number;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    OEB?: number;
    
    @IsOptional()
    @IsString()
    nameFa?: string;
    
    @IsOptional()
    @IsBoolean()
    isStrile?: boolean;
    
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    actual?: number;
    
    @IsOptional()
    @IsString()
    startFrom?: string;
    
    @IsOptional()
    @IsDateString()
    opensDate?: string;
}
