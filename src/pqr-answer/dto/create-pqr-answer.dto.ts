import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePqrAnswerDto {
  @ApiProperty({
    description: 'ID of the PQR form',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Form ID must be an integer' })
  @Min(1, { message: 'Form ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  formId: number;

  @ApiProperty({
    description: 'ID of the PQR item (question)',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Item ID must be an integer' })
  @Min(1, { message: 'Item ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  itemId: number;

  @ApiPropertyOptional({
    description: 'Answer to the question',
    example: 'بله',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  answer?: string;

  @ApiPropertyOptional({
    description: 'Additional details for the answer',
    example: 'توضیحات تکمیلی',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  details?: string;
}
