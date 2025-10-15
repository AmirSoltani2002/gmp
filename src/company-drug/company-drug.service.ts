import { Injectable } from '@nestjs/common';
import { CreateCompanyDrugDto } from './dto/create-company-drug.dto';
import { UpdateCompanyDrugDto } from './dto/update-company-drug.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompanyDrugService {
  constructor(private readonly db: DatabaseService) {}

  async create(createCompanyDrugDto: CreateCompanyDrugDto) {
    return this.db.companyDrug.create({ data: createCompanyDrugDto });
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.db.companyDrug.findMany({
        skip: skip,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.db.companyDrug.count({ }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number) {
    return this.db.companyDrug.findUnique({ where: { id } });
  }

  async update(id: number, updateCompanyDrugDto: UpdateCompanyDrugDto) {
    return this.db.companyDrug.update({
      where: { id },
      data: updateCompanyDrugDto,
    });
  }

  async remove(id: number) {
    return this.db.companyDrug.delete({ where: { id } });
  }
}