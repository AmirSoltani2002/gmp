import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMachineDto {
    @IsOptional()
    @IsNumber()
    siteId: number;

    @IsOptional()
    @IsNumber()
    lineId: number;

    @IsNumber()
    machineTypeId: number;
    
    @IsOptional()
    @IsString()
    country: string;

    @IsOptional()
    @IsString()
    brand: string;
    
    @IsOptional()
    @IsString()
    model: string;

    @IsOptional()
    @IsDateString()
    manufactureDate: string;
    
    @IsOptional()
    @IsDateString()
    installationDate: string;
    
    @IsOptional()
    @IsNumber()
    nominalCapacity: number;
    
    @IsOptional()
    @IsNumber()
    actualCapacity: number;
    
    @IsOptional()
    @IsBoolean()
    DQ: boolean;
    
    @IsOptional()
    @IsBoolean()
    IQ: boolean;
    
    @IsOptional()
    @IsBoolean()
    OQ: boolean;
    
    @IsOptional()
    @IsBoolean()
    PQ: boolean;
    

}
