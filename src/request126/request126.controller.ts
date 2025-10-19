import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import type { CrudRequest } from '@nestjsx/crud';
import { Request126Service } from './request126.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { Request126 } from './entities/request126.entity';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Crud({
  model: { type: Request126 },
  dto: {
    create: CreateRequest126Dto,
    update: UpdateRequest126Dto,
  },
  query: {
    limit: 20,
    maxLimit: 100,
    alwaysPaginate: true,
    filter: {
      closedAt: {
        $isnull: true,
      },
    },
    join: {
      company: { eager: true },
      line: { eager: true },
      drug: { eager: true },
    },
    sort: [
      {
        field: 'createdAt',
        order: 'DESC',
      },
    ],
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
})
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('request126')
@ApiBearerAuth('bearer-key')
@Controller('request126')
export class Request126Controller {
  constructor(public service: Request126Service) {}
}
