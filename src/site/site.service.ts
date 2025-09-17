import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SiteService {
  constructor(private readonly db: DatabaseService){}

  create(createSiteDto: CreateSiteDto) {
    return this.db.site.create({
      data: createSiteDto
    })
  }

  findAll() {
    return this.db.site.findMany({
      include: {company: true}
    });
  }

  findOne(id: number) {
    return this.db.site.findUniqueOrThrow({
      where: {id},
      include: {company: true}
    })
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return this.db.site.update({
      where: {id},
      data: updateSiteDto
    })
  }

  remove(id: number) {
    return this.db.site.delete({
      where: {id}
    })
  }
}
