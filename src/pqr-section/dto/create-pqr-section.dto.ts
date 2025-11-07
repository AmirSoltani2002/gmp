import { IsString, IsInt, MinLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePqrSectionDto {
  @ApiProperty({
    description: 'Section title in Farsi',
    example: 'بخش اول',
    minLength: 1,
  })
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  titleFa: string;

  @ApiProperty({
    description: 'Display order of the section',
    example: 1,
    minimum: 0,
  })
  @IsInt({ message: 'Order must be an integer' })
  @Min(0, { message: 'Order must be non-negative' })
  @Transform(({ value }) => parseInt(value))
  order: number;
}
