import { IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentAssociationDto {
  @ApiProperty({ 
    description: 'Document ID', 
    example: 1,
    minimum: 1
  })
  @IsInt({ message: 'Document ID must be an integer' })
  @Min(1, { message: 'Document ID must be greater than 0' })
  @Transform(({ value }) => parseInt(value))
  documentId: number;

  @ApiProperty({ 
    description: 'Entity ID (siteId, lineId, companyId, or requestId)', 
    example: 1,
    minimum: 1
  })
  @IsInt({ message: 'Entity ID must be an integer' })
  @Min(1, { message: 'Entity ID must be greater than 0' })
  @Transform(({ value }) => parseInt(value))
  entityId: number;
}