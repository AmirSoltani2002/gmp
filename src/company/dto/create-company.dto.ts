import { IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
    @IsString()
    nameFa: string;
    @IsString()
    nationalId: string;
    @IsString()
    @IsOptional()
    desc?: string;
    @IsString()
    img: string;
    @IsString()
    nameEn: string;
    @IsString()
    country: string;
}
