import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompanyPersonDto } from './dto/create-company-person.dto';
import { UpdateCompanyPersonDto } from './dto/update-company-person.dto';

@Injectable()
export class CompanyPersonService {
  constructor(private readonly db: DatabaseService) {}

  create(createCompanyPersonDto: CreateCompanyPersonDto) {
    return this.db.companyPerson.create({
      data: createCompanyPersonDto,
    });
  }

  findAll() {
    return this.db.companyPerson.findMany();
  }

  findOne(id: number) {
    return this.db.companyPerson.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCompanyPersonDto: UpdateCompanyPersonDto) {
    return this.db.companyPerson.update({
      where: { id },
      data: updateCompanyPersonDto,
    });
  }

  remove(id: number) {
    return this.db.companyPerson.delete({
      where: { id },
    });
  }
}