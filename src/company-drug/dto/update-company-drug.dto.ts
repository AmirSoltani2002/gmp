import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDrugDto } from './create-company-drug.dto';

export class UpdateCompanyDrugDto extends PartialType(CreateCompanyDrugDto) {}
