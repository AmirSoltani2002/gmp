import { IsString, MinLength, IsOptional, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UploadDocumentDto {
  @ApiProperty({
    description: 'Company ID',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  companyId: number;

  @ApiProperty({
    description: 'Document title',
    example: 'Safety Protocol Document',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Document description',
    example: 'Detailed safety protocols for manufacturing line operations',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}