import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLineDto {
    @IsOptional()
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
    @IsString()
    @IsString()
    startFrom?: string;
    @IsOptional()
    @IsDate()
    opensDate?: Date;
}
