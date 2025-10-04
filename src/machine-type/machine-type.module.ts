import { Module } from '@nestjs/common';
import { MachineTypeService } from './machine-type.service';
import { MachineTypeController } from './machine-type.controller';

@Module({
  controllers: [MachineTypeController],
  providers: [MachineTypeService],
  exports: [MachineTypeService],
})
export class MachineTypeModule {}
