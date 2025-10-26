import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { MachineTypeModule } from 'src/machine-type/machine-type.module';
import { SiteModule } from 'src/site/site.module';
import { LineModule } from 'src/line/line.module';
import { PersonModule } from 'src/person/person.module';

@Module({
  controllers: [MachineController],
  providers: [MachineService],
  imports: [MachineTypeModule, SiteModule, LineModule, PersonModule],
  exports: [MachineService],
})
export class MachineModule {}
