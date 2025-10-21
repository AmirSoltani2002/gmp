import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllDocumentAssociationDto {
  @ApiPropertyOptional({
    description: 'Filter by document ID',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt({ message: 'Document ID must be an integer' })
  @Min(1, { message: 'Document ID must be greater than 0' })
  @Transform(({ value }) => parseInt(value))
  documentId?: number;

  @ApiPropertyOptional({
    description: 'Filter by entity ID (site/line/company/request126)',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt({ message: 'Entity ID must be an integer' })
  @Min(1, { message: 'Entity ID must be greater than 0' })
  @Transform(({ value }) => parseInt(value))
  entityId?: number;

  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be greater than 0' })
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsInt({ message: 'Page size must be an integer' })
  @Min(1, { message: 'Page size must be greater than 0' })
  @Max(100, { message: 'Page size cannot exceed 100' })
  @Transform(({ value }) => parseInt(value))
  pageSize?: number;
}