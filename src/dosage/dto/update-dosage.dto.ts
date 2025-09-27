import { PartialType } from '@nestjs/swagger';
import { CreateDosageDto } from './create-dosage.dto';

export class UpdateDosageDto extends PartialType(CreateDosageDto) {}
