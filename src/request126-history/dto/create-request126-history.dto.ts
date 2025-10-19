import { IsString, IsInt, IsOptional, IsDateString, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRequest126HistoryDto {
  @ApiProperty({
    description: 'ID of the related Request126',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Request ID must be an integer' })
  @Min(1, { message: 'Request ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  requestId: number;

  @ApiProperty({
    description: 'ID of the person performing the action',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Actor ID must be an integer' })
  @Min(1, { message: 'Actor ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  actorId: number;

  @ApiProperty({
    description: 'Action performed (e.g., created, assigned, approved, rejected)',
    example: 'assigned',
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: 'Action cannot be empty' })
  action: string;

  @ApiProperty({
    description: 'Status before the action',
    example: 'pending',
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: 'From status cannot be empty' })
  fromStatus: string;

  @ApiProperty({
    description: 'Status after the action',
    example: 'assigned',
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: 'To status cannot be empty' })
  toStatus: string;

  @ApiProperty({
    description: 'ID of the person assigned after the action',
    example: 2,
    minimum: 1,
  })
  @IsInt({ message: 'Assignee ID must be an integer' })
  @Min(1, { message: 'Assignee ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  toAssigneeId: number;

  @ApiPropertyOptional({
    description: 'Optional message or comment about the action',
    example: 'Request assigned to quality team for review',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Date when the action was completed (ISO 8601 format)',
    example: '2025-10-19T10:30:00Z',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date must be a valid ISO 8601 date string' },
  )
  endedAt?: string;
}