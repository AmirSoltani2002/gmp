import { IsOptional, IsString } from 'class-validator';

export class CreateDosageDto {
    @IsString()
    emaCode: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    labelEn?: string;

    @IsOptional()
    @IsString()
    labelFa?: string;
}
