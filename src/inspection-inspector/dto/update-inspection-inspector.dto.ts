import { PartialType } from '@nestjs/swagger';
import { CreateInspectionInspectorDto } from './create-inspection-inspector.dto';

export class UpdateInspectionInspectorDto extends PartialType(CreateInspectionInspectorDto) {}
