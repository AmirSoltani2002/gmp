import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SendBackRequest126Dto {
  @ApiPropertyOptional({
    description: 'Optional message to include when sending request back to manager',
    example: 'Request sent back to manager for final decision.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  message?: string;
}

