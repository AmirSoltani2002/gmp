import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Safety Protocol Document',
  })
  @IsString()
  @MinLength(1)
  title: string;
}