import { IsOptional, IsString, IsInt, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class FindAllRequest126Dto {
  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsString()
  search?: string; // For searching type
}
