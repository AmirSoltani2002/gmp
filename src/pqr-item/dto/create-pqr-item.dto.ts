import { IsString, IsInt, MinLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePqrItemDto {
  @ApiProperty({
    description: 'ID of the parent section',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'Section ID must be an integer' })
  @Min(1, { message: 'Section ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  sectionId: number;

  @ApiProperty({
    description: 'Question text in Farsi',
    example: 'آیا شرکت دارای مجوز تولید است؟',
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: 'Question cannot be empty' })
  questionFa: string;

  @ApiProperty({
    description: 'Display order of the item within the section',
    example: 1,
    minimum: 0,
  })
  @IsInt({ message: 'Order must be an integer' })
  @Min(0, { message: 'Order must be non-negative' })
  @Transform(({ value }) => parseInt(value))
  order: number;
}
