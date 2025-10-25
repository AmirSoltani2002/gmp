import { Module } from '@nestjs/common';
import { MedicalReportController } from './medical-report.controller';
import { MedicalReportService } from './medical-report.service';
import { DocumentS3Service } from '../s3/document.s3.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MedicalReportController],
  providers: [MedicalReportService, DocumentS3Service],
  exports: [MedicalReportService],
})
export class MedicalReportModule {}
