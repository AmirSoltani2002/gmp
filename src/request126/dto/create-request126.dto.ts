import { IsString, IsInt, IsNumber, IsOptional, IsDateString, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRequest126Dto {
  @ApiPropertyOptional({
    description: 'Type of the request (e.g., safety-assessment, quality-check)',
    example: 'safety-assessment',
    minLength: 1,
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Type cannot be empty' })
  type?: string;

  @ApiProperty({
    description: 'ID of the company making the request',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @IsInt({ message: 'Company ID must be an integer' })
  @Min(1, { message: 'Company ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  companyId: number;

  @ApiPropertyOptional({
    description: 'ID of the production line',
    example: 1,
    minimum: 1,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsInt({ message: 'Line ID must be an integer' })
  @Min(1, { message: 'Line ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  lineId?: number;

  @ApiPropertyOptional({
    description: 'ID of the drug being processed',
    example: 1,
    minimum: 1,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsInt({ message: 'Drug ID must be an integer' })
  @Min(1, { message: 'Drug ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  drugId?: number;

  @ApiPropertyOptional({
    description: 'Declared Occupational Exposure Band (OEB) value',
    example: 1,
    minimum: 0,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsInt({ message: 'Drug OEB must be an integer' })
  @Min(0, { message: 'Drug OEB must be non-negative' })
  @Transform(({ value }) => parseInt(value))
  drugOEB_declared?: number;

  @ApiPropertyOptional({
    description: 'Declared Occupational Exposure Limit (OEL) value in μg/m³',
    example: 0.5,
    minimum: 0,
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Drug OEL must be a number' })
  @Min(0, { message: 'Drug OEL must be non-negative' })
  @Transform(({ value }) => parseFloat(value))
  drugOEL_declared?: number;

  @ApiPropertyOptional({
    description: 'Date when the request was closed (ISO 8601 format)',
    example: '2025-10-19T10:30:00Z',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Closed date must be a valid ISO 8601 date string' },
  )
  closedAt?: string;
}
