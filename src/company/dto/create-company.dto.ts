import { Optional } from "@nestjs/common";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    nameFa: string;
    @IsString()
    @Optional()
    nationalId?: string;
    @IsString()
    @IsOptional()
    desc?: string;
    @IsString()
    @Optional()
    img?: string;
    @IsString()
    @Optional()
    nameEn?: string;
    @IsString()
    @Optional()
    country?: string;
    @IsString()
    @Optional()
    mainAddress?: string;
    @IsString()
    @Optional()
    website?: string;
    @IsString()
    @Optional()
    province?: string;
    @IsString()
    @Optional()
    postalCode?: string;
    @IsString()
    @Optional()
    city?: string;
    @IsString()
    @Optional()
    registrationData?: Date;
    @IsString()
    @Optional()
    registrationNumber?: number;
    @IsEmail()
    @IsOptional()
    email?: string;
}
