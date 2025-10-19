import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllRequest126Dto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page (alias for limit)',
    example: 20,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter by request type',
    example: 'safety-assessment'
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description: 'Filter by company ID',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  companyId?: number;

  @ApiPropertyOptional({
    description: 'Search across multiple fields (type, company name, drug name, line name)',
    example: 'assessment'
  })
  @IsOptional()
  @IsString()
  q?: string; // Changed from 'search' to 'q' to match company service

  @ApiPropertyOptional({
    description: 'Legacy search parameter (for backward compatibility)',
    example: 'assessment'
  })
  @IsOptional()
  @IsString()
  search?: string;
}
