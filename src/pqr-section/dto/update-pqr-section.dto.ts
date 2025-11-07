import { PartialType } from '@nestjs/swagger';
import { CreatePqrSectionDto } from './create-pqr-section.dto';

export class UpdatePqrSectionDto extends PartialType(CreatePqrSectionDto) {}
