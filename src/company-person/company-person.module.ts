import { Module } from '@nestjs/common';
import { CompanyPersonService } from './company-person.service';
import { CompanyPersonController } from './company-person.controller';

@Module({
  controllers: [CompanyPersonController],
  providers: [CompanyPersonService],
})
export class CompanyPersonModule {}
