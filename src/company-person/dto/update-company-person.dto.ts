import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyPersonDto } from './create-company-person.dto';

export class UpdateCompanyPersonDto extends PartialType(CreateCompanyPersonDto) {}