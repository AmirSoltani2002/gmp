import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PersonModule } from 'src/person/person.module';
import { MachineModule } from 'src/machine/machine.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [PersonModule, MachineModule]
})
export class CompanyModule {}
