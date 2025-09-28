import { IsBoolean, IsNumber, IsString, IsOptional } from "class-validator";

export class CreateSiteDto {
    @IsNumber()
    companyId: number;
    @IsString()
    @IsOptional()
    country?: string;
    @IsString()
    @IsOptional()
    city?: string;
    @IsString()
    @IsOptional()
    address?: string;
    @IsNumber()
    @IsOptional()
    gpsLat?: number;
    @IsNumber()
    @IsOptional()
    gpsLng?: number;
    @IsBoolean()
    @IsOptional()
    isPrimary?: boolean;
    @IsString()
    @IsOptional()
    GLN?: string;
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsString()
    province?: string;
}
