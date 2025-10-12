import { Injectable } from '@nestjs/common';
import { CreateCompanyDrugDto } from './dto/create-company-drug.dto';
import { UpdateCompanyDrugDto } from './dto/update-company-drug.dto';

@Injectable()
export class CompanyDrugService {
  create(createCompanyDrugDto: CreateCompanyDrugDto) {
    return 'This action adds a new companyDrug';
  }

  findAll() {
    return `This action returns all companyDrug`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyDrug`;
  }

  update(id: number, updateCompanyDrugDto: UpdateCompanyDrugDto) {
    return `This action updates a #${id} companyDrug`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyDrug`;
  }
}
