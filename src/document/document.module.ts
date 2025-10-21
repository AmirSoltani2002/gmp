import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentS3Service } from '../s3/document.s3.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentS3Service],
  exports: [DocumentService],
})
export class DocumentModule {}