import { PartialType } from '@nestjs/swagger';
import { CreatePqrItemDto } from './create-pqr-item.dto';

export class UpdatePqrItemDto extends PartialType(CreatePqrItemDto) {}
