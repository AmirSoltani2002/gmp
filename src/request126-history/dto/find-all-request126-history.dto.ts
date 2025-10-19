import { IsOptional, IsString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllRequest126HistoryDto {
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
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Legacy limit parameter',
    example: 20
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter by request ID',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  requestId?: number;

  @ApiPropertyOptional({
    description: 'Filter by actor (person who performed the action) ID',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  actorId?: number;

  @ApiPropertyOptional({
    description: 'Filter by assignee (person assigned after the action) ID',
    example: 2,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  toAssigneeId?: number;

  @ApiPropertyOptional({
    description: 'Filter by action type',
    example: 'assigned'
  })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({
    description: 'Filter by status after the action',
    example: 'approved'
  })
  @IsOptional()
  @IsString()
  toStatus?: string;

  @ApiPropertyOptional({
    description: 'Search across action, status, and message fields',
    example: 'approved'
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Legacy search parameter (for backward compatibility)',
    example: 'approved'
  })
  @IsOptional()
  @IsString()
  search?: string;
}