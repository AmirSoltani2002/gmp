import { IsOptional, IsString } from 'class-validator';

export class CreateMachineTypeDto {
    @IsString()
    nameEn: string;

    @IsString()
    nameFa: string;

    @IsString()
    scope: string;
}
