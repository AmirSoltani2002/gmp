import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ContactService {
  constructor(private readonly db: DatabaseService){}

  create(createContactDto: CreateContactDto) {
    return this.db.contact.create({
      data: createContactDto,
    })
  }

  findAll() {
    return this.db.contact.findMany({
      include: {company: true}
    })
  }

  findOne(id: number) {
    return this.db.contact.findUniqueOrThrow({
      where: {id},
      include: {company: true}
    }) 
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return this.db.contact.update({
      where: {id},
      data: updateContactDto
    })
  }

  remove(id: number) {
    return this.db.contact.delete({
      where: {id}
    })
  }
}
