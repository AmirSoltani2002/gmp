import { Injectable } from '@nestjs/common';
import { CreateMachineTypeDto } from './dto/create-machine-type.dto';
import { UpdateMachineTypeDto } from './dto/update-machine-type.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MachineTypeService {
  constructor(private readonly db: DatabaseService){}

  create(createMachineTypeDto: CreateMachineTypeDto) {
    return this.db.machineType.create({
      data: createMachineTypeDto
    });
  }

  findAll() {
    return this.db.machineType.findMany();
  }

  findOne(id: number) {
    return this.db.machineType.findUniqueOrThrow({
      where: {id}
    });
  }

  update(id: number, updateMachineTypeDto: UpdateMachineTypeDto) {
    return this.db.machineType.update({
      where: {id},
      data: updateMachineTypeDto,
    });
  }

  remove(id: number) {
    return this.db.machineType.delete({
      where: {id}
    })
  }
}
