import { Module } from '@nestjs/common';
import { CompanyDrugService } from './company-drug.service';
import { CompanyDrugController } from './company-drug.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyDrugController],
  providers: [CompanyDrugService],
})
export class CompanyDrugModule {}
