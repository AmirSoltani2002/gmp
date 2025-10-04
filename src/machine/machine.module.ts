import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { MachineTypeModule } from 'src/machine-type/machine-type.module';
import { SiteModule } from 'src/site/site.module';
import { LineModule } from 'src/line/line.module';

@Module({
  controllers: [MachineController],
  providers: [MachineService],
  imports: [MachineTypeModule, SiteModule, LineModule],
  exports: [MachineService],
})
export class MachineModule {}
