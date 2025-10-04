import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DatabaseService } from 'src/database/database.service';
import { Machine } from 'src/machine/entities/machine.entity';

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
      include: {persons: {
        include: {
          person: true
        }
      }}
    })
  }

  findOneSites(id: number) {
    return this.db.company.findUniqueOrThrow({
      where: {id},
      include: {sites: {
        include: {
          lines: true,
        }
      }}
    })
  }

  async findOneMachines(id: number) {
    const nestedMachines = (await this.db.company.findUniqueOrThrow({
      where: {id},
      include: {sites: {
        include: {
          lines: {
            include: {machines: {include: {machineType: true}}}
          }, 
          machines: {include: {machineType: true}}
        }
      }}
    })).sites;
    const siteMachines = nestedMachines.flatMap(x => x.machines);
    const lineMachines = nestedMachines.flatMap(x => x.lines.flatMap(x => x.machines));
    return {
      siteLevel: siteMachines,
      lineLevel: lineMachines,
    }
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
