import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetPresignedUrlDto {
  @ApiProperty({
    description: 'File key in S3',
    example: 'documents/my-document.pdf',
  })
  @IsString()
  key: string;

  @ApiPropertyOptional({
    description: 'URL expiration time in seconds (default: 3600 = 1 hour)',
    example: 3600,
    minimum: 60,
    maximum: 604800, // 7 days
  })
  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(604800)
  @Transform(({ value }) => parseInt(value))
  expiresIn?: number = 3600;
}