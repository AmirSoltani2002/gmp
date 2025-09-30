import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PersonService {
  constructor(private readonly db: DatabaseService){}

  async create(createPersonDto: CreatePersonDto & { currentCompanyId?: number }) {
    const { currentCompanyId, ...data } = createPersonDto;

    // create person
    const person = await this.db.person.create({ data });

    // add current company if provided
    if (currentCompanyId) {
      await this.db.companyPerson.create({
        data: { personId: person.id, companyId: currentCompanyId }
      });
    }

    return person;
  }

  findAll() {
    return this.db.person.findMany({
      include: { 
        companies: { where: { endedAt: null }, include: { company: true } } 
      } // only current company
    });
  }

  findOne(id: number) {
    return this.db.person.findUniqueOrThrow({
      where: { id },
      include: { 
        companies: { where: { endedAt: null }, include: { company: true } } 
      }
    });
  }

  findOneByUsername(username: string) {
    return this.db.person.findUniqueOrThrow({
      where: { username },
      include: { 
        companies: { where: { endedAt: null }, include: { company: true } } 
      }
    });
  }

  async update(id: number, updatePersonDto: UpdatePersonDto & { currentCompanyId?: number }) {
    const { currentCompanyId, ...data } = updatePersonDto;

    const person = await this.db.person.update({ where: { id }, data });

    if (currentCompanyId) {
      // end previous current company
      await this.db.companyPerson.updateMany({
        where: { personId: id, endedAt: null },
        data: { endedAt: new Date() }
      });

      // add new current company
      await this.db.companyPerson.create({
        data: { personId: id, companyId: currentCompanyId }
      });
    }

    return person;
  }

  remove(id: number) {
    return this.db.person.delete({ where: { id } });
  }

  removeByUsername(username: string) {
    return this.db.person.delete({ where: { username } });
  }
}
