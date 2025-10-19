import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Request126HistoryService } from './request126-history.service';
import { CreateRequest126HistoryDto } from './dto/create-request126-history.dto';
import { UpdateRequest126HistoryDto } from './dto/update-request126-history.dto';
import { Request126History } from './entities/request126-history.entity';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Crud({
  model: { type: Request126History },
  dto: {
    create: CreateRequest126HistoryDto,
    update: UpdateRequest126HistoryDto,
  },
  query: {
    limit: 20,
    maxLimit: 100,
    alwaysPaginate: true,
    join: {
      request: { eager: true },
      actor: { eager: true },
      toAssignee: { eager: true },
      'request.company': { eager: true },
      'request.line': { eager: true },
      'request.drug': { eager: true },
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
@ApiTags('request126-history')
@ApiBearerAuth('bearer-key')
@Controller('request126-history')
export class Request126HistoryController {
  constructor(public service: Request126HistoryService) {}
}