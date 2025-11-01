import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDrugDto } from './dto/create-company-drug.dto';
import { UpdateCompanyDrugDto } from './dto/update-company-drug.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompanyDrugService {
  constructor(private readonly db: DatabaseService) {}

  async create(createCompanyDrugDto: CreateCompanyDrugDto) {
    try {
      return await this.db.companyDrug.create({ data: createCompanyDrugDto });
    } catch (error) {
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        const fields = Array.isArray(target) ? target.join(', ') : target || 'unknown';
        throw new ConflictException(
          `A company drug with the same ${fields} already exists. Please check IRC, brandOwnerId, drugId, or other unique fields.`
        );
      }
      throw error;
    }
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
    return this.db.companyDrug.findUnique({ 
      where: { id },
      include: {
        brandOwner: true,
        supplier: true,
        drug: true,
        line: {
          include: {
            site: {
              include: {
                company: true,
              }
            }
          }
        }
      }
    });
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