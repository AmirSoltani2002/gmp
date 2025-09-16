import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PersonService {
  constructor(private readonly db: DatabaseService){}

  create(createPersonDto: CreatePersonDto) {
    return this.db.person.create({
      data: createPersonDto
    })
  }

  findAll() {
    return this.db.person.findMany({
      include: {currentCompany: true}
    })
  }

  findOne(id: number) {
    return this.db.person.findUniqueOrThrow({
      where: {id},
      include: {currentCompany: true}
    })
  }

  findOneByUsername(username: string) {
    return this.db.person.findUniqueOrThrow({
      where: {username},
      include: {currentCompany: true}
    })
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return this.db.person.update({
      where: {id},
      data: updatePersonDto
    })
  }

  remove(id: number) {
    return this.db.person.delete({
      where: {id}
    })
  }

  removeByUsername(username: string) {
    return this.db.person.delete({
      where: {username}
    })
  }
}
