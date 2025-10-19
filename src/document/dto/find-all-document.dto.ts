import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllDocumentDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Search in title and filename',
    example: 'safety',
  })
  @IsOptional()
  @IsString()
  q?: string;
}