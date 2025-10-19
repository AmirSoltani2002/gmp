import { Module } from '@nestjs/common';
import { DocumentAssociationController } from './document-association.controller';
import { DocumentAssociationService } from './document-association.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentAssociationController],
  providers: [DocumentAssociationService],
  exports: [DocumentAssociationService],
})
export class DocumentAssociationModule {}