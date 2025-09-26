import { Injectable } from '@nestjs/common';
import { CreateLineDto } from './dto/create-line.dto';
import { UpdateLineDto } from './dto/update-line.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LineService {
  constructor(private readonly db: DatabaseService){}

  create(createLineDto: CreateLineDto) {
    const {siteId, ...rest} = createLineDto;
    return this.db.line.create({
      data: {
        site: {connect: {id: siteId}},
        ...rest
      }
    })
  }

  findAll() {
    return this.db.line.findMany()
  }

  findOne(id: number) {
    return this.db.line.findUniqueOrThrow({
      where: {id}
    })
  }

  update(id: number, updateLineDto: UpdateLineDto) {
    return this.db.line.update({
      where: {id}
    })
  }

  remove(id: number) {
    return this.db.line.delete({
      where: {id}
    })
  }
}
