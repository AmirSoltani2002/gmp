import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { MachineTypeModule } from 'src/machine-type/machine-type.module';

@Module({
  controllers: [MachineController],
  providers: [MachineService],
  imports: [MachineTypeModule],
  exports: [MachineService],
})
export class MachineModule {}
