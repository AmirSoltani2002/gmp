import { PartialType } from '@nestjs/swagger';
import { UploadDocumentDto } from './upload-document.dto';

export class UpdateDocumentDto extends PartialType(UploadDocumentDto) {}
