import { IsOptional, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllInspectionInspectorDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Legacy limit parameter',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search term',
    example: 'inspector name',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Legacy search parameter',
    example: 'inspector name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by inspection ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  inspectionId?: number;

  @ApiPropertyOptional({
    description: 'Filter by person ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  personId?: number;
}
