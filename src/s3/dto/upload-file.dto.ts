import { IsString, IsOptional, IsInt, Min, Max, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'Folder to store the file in',
    example: 'documents',
  })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiPropertyOptional({
    description: 'Custom file name (will generate if not provided)',
    example: 'my-document.pdf',
  })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({
    description: 'File metadata as JSON object',
    example: { userId: '123', category: 'report' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'File tags as JSON object',
    example: { environment: 'production', type: 'report' },
  })
  @IsOptional()
  @IsObject()
  tags?: Record<string, string>;
}