import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AssignRequest126Dto {
  @ApiProperty({
    description: 'ID of the person to assign the request to',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @IsInt({ message: 'Person ID must be an integer' })
  @Min(1, { message: 'Person ID must be positive' })
  @Transform(({ value }) => parseInt(value))
  personId: number;
}

