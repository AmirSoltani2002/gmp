import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CopyFileDto {
  @ApiProperty({
    description: 'Source file key',
    example: 'documents/original.pdf',
  })
  @IsString()
  sourceKey: string;

  @ApiProperty({
    description: 'Destination file key',
    example: 'backups/original-backup.pdf',
  })
  @IsString()
  destinationKey: string;
}