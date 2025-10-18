import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Request126Service } from './request126.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { Request126 } from './entities/request126.entity';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';

@Crud({
  model: { type: Request126 }, // Point to entity, not service
  dto: {
    create: CreateRequest126Dto,
    update: UpdateRequest126Dto,
  },
  query: {
    limit: 20,
    maxLimit: 100,
    alwaysPaginate: true,
    filter: { closedAt: { $isNull: true } }, // Like queryset.filter(closedAt__isnull=True)
    join: {
      company: { eager: true },
      line: { eager: true },
      drug: { eager: true },
    },
    search: {
      $or: [{ type: { $cont: '$value' } }],
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
})
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP], // Changed from PUT to PATCH
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@Controller('request126')
export class Request126Controller implements CrudController<Request126Service> {
  constructor(public service: Request126Service) {}
}
