import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { PersonModule } from './person/person.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalGuard } from './auth/auth.guard';
import { PrismaExceptionFilter } from 'src/filters/prisma-exception.filter';
import { SiteModule } from './site/site.module';
import { LineModule } from './line/line.module';
import { LineDosageModule } from './line-dosage/line-dosage.module';
import { DosageModule } from './dosage/dosage.module';
import { CompanyPersonModule } from './company-person/company-person.module';
import { MachineTypeModule } from './machine-type/machine-type.module';
import { MachineModule } from './machine/machine.module';
import { DrugModule } from './drug/drug.module';
import { CompanyDrugModule } from './company-drug/company-drug.module';
import { Request126Module } from './request126/request126.module';
import { Request126HistoryModule } from './request126-history/request126-history.module';
import { DocumentModule } from './document/document.module';
import { DocumentAssociationModule } from './document-association/document-association.module';
import { MedicalReportModule } from './medical-report/medical-report.module';
import { InspectionModule } from './inspection/inspection.module';
import { InspectionInspectorModule } from './inspection-inspector/inspection-inspector.module';
import { PqrSectionModule } from './pqr-section/pqr-section.module';
import { PqrItemModule } from './pqr-item/pqr-item.module';
import { PqrAnswerModule } from './pqr-answer/pqr-answer.module';

@Module({
  imports: [
    CompanyModule,
    PersonModule,
    DatabaseModule,
    AuthModule,
    SiteModule,
    LineModule,
    LineDosageModule,
    DosageModule,
    CompanyPersonModule,
    MachineTypeModule,
    MachineModule,
    DrugModule,
    CompanyDrugModule,
    Request126Module,
    Request126HistoryModule,
    DocumentModule,
    MedicalReportModule,
    DocumentAssociationModule,
    InspectionModule,
    InspectionInspectorModule,
    PqrSectionModule,
    PqrItemModule,
    PqrAnswerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
