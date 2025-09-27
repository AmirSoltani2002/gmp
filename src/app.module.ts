import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { ContactModule } from './contact/contact.module';
import { PersonModule } from './person/person.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalGuard } from './auth/auth.guard';
import { PrismaExceptionFilter } from 'filters/prisma-exception.filter';
import { SiteModule } from './site/site.module';
import { LineModule } from './line/line.module';
import { LineDosageModule } from './line-dosage/line-dosage.module';
import { DosageModule } from './dosage/dosage.module';

@Module({
  imports: [CompanyModule, ContactModule, PersonModule, DatabaseModule, AuthModule, SiteModule, LineModule, LineDosageModule, DosageModule],
  controllers: [AppController],
  providers: [AppService,
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
