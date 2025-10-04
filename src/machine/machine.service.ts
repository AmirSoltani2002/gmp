import { Injectable } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MachineService {
  constructor(private readonly db: DatabaseService){}

  create(createMachineDto: CreateMachineDto) {
    return this.db.machine.create({
      data: createMachineDto
    });
  }

  findAll() {
    return this.db.machine.findMany({
      include: {
        machineType: true
      }
    });
  }

  findOne(id: number) {
    return this.db.machine.findUniqueOrThrow({
      where: {id},
      include: {machineType: true}
    });
  }

  update(id: number, updateMachineDto: UpdateMachineDto) {
    return this.db.machine.update({
      where: {id},
      data: updateMachineDto,
    });
  }

  remove(id: number) {
    return this.db.machine.delete({
      where: {id}
    });
  }
}
