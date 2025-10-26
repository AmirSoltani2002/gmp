import { Module } from '@nestjs/common';
import { CompanyDrugService } from './company-drug.service';
import { CompanyDrugController } from './company-drug.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports: [DatabaseModule, PersonModule],
  controllers: [CompanyDrugController],
  providers: [CompanyDrugService],
})
export class CompanyDrugModule {}
