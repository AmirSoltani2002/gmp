import { IsString, IsInt, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateRequest126Dto {
  @IsString()
  type: string;

  @IsInt()
  companyId: number;

  @IsInt()
  lineId: number;

  @IsInt()
  drugId: number;

  @IsInt()
  drugOEB_declared: number;

  @IsNumber()
  drugOEL_declared: number;

  @IsOptional()
  @IsDateString()
  closedAt?: string;
}
