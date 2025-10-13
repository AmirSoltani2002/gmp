import { Injectable } from '@nestjs/common';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DrugService {
  constructor(private readonly db: DatabaseService) {}

  async create(createDrugDto: CreateDrugDto) {
    return this.db.drug.create({ data: createDrugDto });
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    q: string = '',
  ) {
    const skip = (page - 1) * pageSize;
    const where = q
      ? {
          OR: [
            { drugIndexName: { contains: q } },
            { genericName: { contains: q } },
          ],
        }
      : {};
    
    const [data, total] = await Promise.all([
      this.db.drug.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.db.drug.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number) {
    return this.db.drug.findUnique({ where: { id } });
  }

  async update(id: number, updateDrugDto: UpdateDrugDto) {
    return this.db.drug.update({
      where: { id },
      data: updateDrugDto,
    });
  }

  async remove(id: number) {
    return this.db.drug.delete({ where: { id } });
  }
}