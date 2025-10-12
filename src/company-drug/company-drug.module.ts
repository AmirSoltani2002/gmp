import { Module } from '@nestjs/common';
import { CompanyDrugService } from './company-drug.service';
import { CompanyDrugController } from './company-drug.controller';

@Module({
  controllers: [CompanyDrugController],
  providers: [CompanyDrugService],
})
export class CompanyDrugModule {}
