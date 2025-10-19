import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
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