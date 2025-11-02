import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DatabaseService } from 'src/database/database.service';
import { FindAllCompanyDto } from './dto/find-all-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly db: DatabaseService){}

  create(createCompanyDto: CreateCompanyDto) {
    return this.db.company.create({
      data: createCompanyDto
    })
  }

  async findAll(query: FindAllCompanyDto) {
    const { page = 1, pageSize = 10, q } = query;
    const skip = (page - 1) * pageSize;

    const where = q
      ? {
          OR: [
            { nameFa: { contains: q } },
            { nameEn: { contains: q } },
            { nationalId: { contains: q } },
          ],
        }
      : {};

    const include =
      pageSize < 50
        ? {
            persons: {
              include: {
                person: true,
              },
            },
          }
        : undefined;

    const [companies, totalItems] = await this.db.$transaction([
      this.db.company.findMany({
        where,
        include,
        skip,
        take: +pageSize,
      }),
      this.db.company.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: companies,
      totalItems,
      totalPages,
      currentPage: +page,
    };
  }

  findOne(id: number) {
    return this.db.company.findUniqueOrThrow({
      where: {id},
    })
  }

  async findOneUsers(id: number) {
    const rawData = await this.db.company.findUniqueOrThrow({
      where: {id},
      include: {persons: {
        include: {
          person: true
        }
      }}
    });
    // remove passwordHash from person
    const data = rawData.persons.map(companyPerson => {
      const person = companyPerson.person;
      const {passwordHash, ...rest} = person;
      return {
        ...companyPerson,
        person: rest
      }
    });
    const {persons, ...rest} = rawData;
    return {
      ...rest,
      persons: data
    }
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
  findOneSitesByUser(id: number) {
    return this.db.person.findUniqueOrThrow({
      where: {id},
      include: {
        companies: {
          // Prefer the current company (no endedAt). If multiple, get the latest by createdAt.
          where: { endedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            company: {
              include: {
                sites: {
                  include: {
                    lines: true,
                  }
                }
              }
            }
          }
        },
        
      }
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
  findOneRequest126s(id: string) {
    const companyId = id === 'all' ? undefined : Number(id);
    return this.db.request126.findMany({
      where: {
        companyId: companyId ?? undefined,
      },
      include: {
        company: true,
        line: true,
        drug: true,
        history: true,
      },
    })
  }
  findOneDrugs(id: number) {
    return this.db.company.findUniqueOrThrow({
      where: {id},
      include: {brandOwnerDrugs: {
        include: {
          drug: true,
          supplier: true,
          line: {
            include: {
              site: {
                include: {
                  company: true,
                }
              }
            }
          },
        }
      }}
    })
  }

  findOneByUser(id: number) {
    return this.db.person.findUniqueOrThrow({
      where: {id},
      include: {
        companies: {
          // Prefer the current company (no endedAt). If multiple, get the latest by createdAt.
          where: { endedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            company: true,
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
