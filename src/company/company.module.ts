import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PersonModule } from 'src/person/person.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [PersonModule]
})
export class CompanyModule {}
