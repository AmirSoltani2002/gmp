import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateContactDto {
    @IsNumber()
    companyId: number;
    @IsString()
    value: string;
    @IsBoolean()
    is_primary: boolean;
    @IsString()
    cityCode: string;
    @IsString()
    @IsOptional()
    title?: string;
}
