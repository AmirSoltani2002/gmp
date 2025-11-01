import { IsDate, IsDateString, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    nameFa: string;
    @IsString()
    nationalId: string;
    @IsString()
    @IsOptional()
    img?: string;
    @IsString()
    @IsOptional()
    nameEn?: string;
    @IsString()
    @IsOptional()
    country?: string;
    @IsString()
    @IsOptional()
    mainAddress?: string;
    @IsString()
    @IsOptional()
    website?: string;
    @IsString()
    @IsOptional()
    province?: string;
    @IsString()
    @IsOptional()
    postalCode?: string;
    @IsString()
    @IsOptional()
    city?: string;
    @IsDateString()
    @IsOptional()
    registrationDate?: string;
    @IsString()
    @IsOptional()
    registrationNumber?: string;

    @IsString()
    @IsOptional()
    contact?: string;
    
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
