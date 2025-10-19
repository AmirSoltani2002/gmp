import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import s3Config from './s3.config';

@Module({
  imports: [
    ConfigModule.forFeature(s3Config),
  ],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service], // Export S3Service for use in other modules
})
export class S3Module {}