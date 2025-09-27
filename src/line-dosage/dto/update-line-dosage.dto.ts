import { PartialType } from '@nestjs/swagger';
import { CreateLineDosageDto } from './create-line-dosage.dto';

export class UpdateLineDosageDto extends PartialType(CreateLineDosageDto) {}
