import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompanyPersonDto } from './dto/create-company-person.dto';
import { UpdateCompanyPersonDto } from './dto/update-company-person.dto';

@Injectable()
export class CompanyPersonService {
  constructor(private readonly db: DatabaseService) {}

  create(createCompanyPersonDto: CreateCompanyPersonDto) {
    return this.db.company_person.create({
      data: createCompanyPersonDto,
    });
  }

  findAll() {
    return this.db.company_person.findMany();
  }

  findOne(id: number) {
    return this.db.company_person.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCompanyPersonDto: UpdateCompanyPersonDto) {
    return this.db.company_person.update({
      where: { id },
      data: updateCompanyPersonDto,
    });
  }

  remove(id: number) {
    return this.db.company_person.delete({
      where: { id },
    });
  }
}