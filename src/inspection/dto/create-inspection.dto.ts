import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateInspectionDto {
  @ApiProperty({
    description: 'ID of the company',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Company ID must be an integer' })
  @Min(1, { message: 'Company ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  companyId: number;

  @ApiProperty({
    description: 'ID of the production line',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Line ID must be an integer' })
  @Min(1, { message: 'Line ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  lineId: number;

  @ApiPropertyOptional({
    description: 'Number of critical findings',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Critical must be an integer' })
  @Min(0, { message: 'Critical must be non-negative' })
  @Transform(({ value }) => parseInt(value))
  critical?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of major findings',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Major must be an integer' })
  @Min(0, { message: 'Major must be non-negative' })
  @Transform(({ value }) => parseInt(value))
  major?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of minor findings',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Minor must be an integer' })
  @Min(0, { message: 'Minor must be non-negative' })
  @Transform(({ value }) => parseInt(value))
  minor?: number = 0;
}
