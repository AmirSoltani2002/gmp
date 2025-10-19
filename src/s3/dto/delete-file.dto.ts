import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteFileDto {
  @ApiProperty({
    description: 'File key in S3 to delete',
    example: 'documents/my-document.pdf',
  })
  @IsString()
  key: string;
}

export class DeleteMultipleFilesDto {
  @ApiProperty({
    description: 'Array of file keys to delete',
    example: ['documents/file1.pdf', 'images/photo.jpg'],
    type: [String],
  })
  @IsString({ each: true })
  keys: string[];
}