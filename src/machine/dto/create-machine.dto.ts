import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMachineDto {
    @IsNumber()
    @IsOptional()
    siteId: number;

    @IsNumber()
    @IsOptional()
    lineId: number;

    @IsNumber()
    machineTypeId: number;
    
    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    brand: string;
    
    @IsString()
    @IsOptional()
    model: string;

    @IsDateString()
    @IsOptional()
    manufactureDate: string;
    
    @IsDateString()
    @IsOptional()
    installationDate: string;
    
    @IsNumber()
    @IsOptional()
    nominalCapacity: number;
    
    @IsNumber()
    @IsOptional()
    actualCapacity: number;
    
    @IsBoolean()
    @IsOptional()
    DQ: boolean;
    
    @IsBoolean()
    @IsOptional()
    IQ: boolean;
    
    @IsBoolean()
    @IsOptional()
    OQ: boolean;
    
    @IsBoolean()
    @IsOptional()
    PQ: boolean;
    

}
