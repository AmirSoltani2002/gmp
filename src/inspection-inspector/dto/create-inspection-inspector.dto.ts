import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateInspectionInspectorDto {
  @ApiProperty({
    description: 'ID of the inspection',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Inspection ID must be an integer' })
  @Min(1, { message: 'Inspection ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  inspectionId: number;

  @ApiProperty({
    description: 'ID of the inspector (person)',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Person ID must be an integer' })
  @Min(1, { message: 'Person ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  personId: number;
}
