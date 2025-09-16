import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CompanyService {
  constructor(private readonly db: DatabaseService){}

  create(createCompanyDto: CreateCompanyDto) {
    return this.db.company.create({
      data: createCompanyDto
    })
  }

  findAll() {
    return this.db.company.findMany()
  }

  findOne(id: number) {
    return this.db.company.findUniqueOrThrow({
      where: {id},
    })
  }

  findOneUsers(id: number) {
    return this.db.company.findUniqueOrThrow({
      where: {id},
      include: {persons: true}
    })
  }

  findOneContact(id: number) {
    return this.db.company.findUniqueOrThrow({
      where: {id},
      include: {contacts: true}
    })
  }

  findOneByUser(id: number) {
    return this.db.company.findFirstOrThrow({
      where: {
        persons: {
          some: {
            id
          }
        }
      }
    })
  }

  updateOneByUser(id: number, updateCompanyDto) {
    return this.db.company.updateMany({
      where: {
        persons: {
          some: {
            id: id
          }
        }
      },
      data: updateCompanyDto
    })
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return this.db.company.update({
      where: {id},
      data: updateCompanyDto
    })
  }

  remove(id: number) {
    return this.db.company.delete({
      where: {id}
    })
  }
}
