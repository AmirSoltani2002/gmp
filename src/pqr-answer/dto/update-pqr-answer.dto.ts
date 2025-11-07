import { PartialType } from '@nestjs/swagger';
import { CreatePqrAnswerDto } from './create-pqr-answer.dto';

export class UpdatePqrAnswerDto extends PartialType(CreatePqrAnswerDto) {}
