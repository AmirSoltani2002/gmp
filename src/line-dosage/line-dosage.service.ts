import { Injectable } from '@nestjs/common';
import { CreateLineDosageDto } from './dto/create-line-dosage.dto';
import { UpdateLineDosageDto } from './dto/update-line-dosage.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LineDosageService {
  constructor(private readonly db: DatabaseService){}

  create(createLineDosageDto: CreateLineDosageDto) {
    return this.db.lineDosage.create({
      data: {
        line: {connect: {id: createLineDosageDto.lineId}},
        dosage: {connect: {id: createLineDosageDto.dosageId}}
      },
    })
  }

  findAll() {
    return this.db.lineDosage.findMany({
      include:{
        line: {
          include: {
            site: {
              include: {
                company: true
              }
            }
          }
        }
      }
    })
  }

  findOne(id: number) {
    return this.db.lineDosage.findUniqueOrThrow({
      where: {id},
      include:{
        line: {
          include: {
            site: {
              include: {
                company: true
              }
            }
          }
        }
      }
    })
  }

  update(id: number, updateLineDosageDto: UpdateLineDosageDto) {
    return this.db.lineDosage.update({
      where: {id},
      data: updateLineDosageDto
    })
  }

  remove(id: number) {
    return this.db.lineDosage.delete({
      where: {id}
    })
  }
}
