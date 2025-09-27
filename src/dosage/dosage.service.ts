import { Injectable } from '@nestjs/common';
import { CreateDosageDto } from './dto/create-dosage.dto';
import { UpdateDosageDto } from './dto/update-dosage.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DosageService {
  constructor(private readonly db: DatabaseService){}

  create(createDosageDto: CreateDosageDto) {
    return this.db.dosage.create({
      data: createDosageDto
    })
  }

  findAll() {
    return this.db.dosage.findMany()
  }

  findOne(id: number) {
    return this.db.dosage.findUniqueOrThrow({
      where: {id},
    })
  }

  update(id: number, updateDosageDto: UpdateDosageDto) {
    return this.db.dosage.update({
      where: {id},
      data: updateDosageDto
    })
  }

  remove(id: number) {
    return this.db.dosage.delete({
      where: {id}
    })
  }
}
