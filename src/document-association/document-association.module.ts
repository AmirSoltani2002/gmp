import { Module } from '@nestjs/common';
import { DocumentAssociationController } from './document-association.controller';
import { DocumentAssociationService } from './document-association.service';
import { DatabaseModule } from '../database/database.module';
import { DocumentService } from '../document/document.service';
import { DocumentS3Service } from '../s3/document.s3.service';
import { PersonService } from '../person/person.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentAssociationController],
  providers: [DocumentAssociationService, DocumentService, DocumentS3Service, PersonService],
  exports: [DocumentAssociationService],
})
export class DocumentAssociationModule {}