import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLineDto {
    @IsNumber()
    siteId: number;
    @IsOptional()
    @IsString()
    nameEn?: string;
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
    @IsOptional()
    @IsNumber()
    capacity?: number;
    @IsOptional()
    @IsNumber()
    OEB?: number;
    @IsOptional()
    @IsString()
    nameFa?: string;
    @IsBoolean()
    @IsOptional()
    isSterile?: boolean;
    @IsNumber()
    @IsOptional()
    actual?: number;
    @IsOptional()
    @IsString()
    startFrom?: string;
    @IsOptional()
    @IsDateString()
    opensDate?: Date;
}
