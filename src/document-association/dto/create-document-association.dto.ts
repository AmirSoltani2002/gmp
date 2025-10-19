import { IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentAssociationDto {
  @ApiProperty({ description: 'Document ID' })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  documentId: number;

  @ApiProperty({ description: 'Entity ID (siteId, lineId, companyId, or requestId)' })
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  entityId: number;
}