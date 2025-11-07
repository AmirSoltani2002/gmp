import { Module } from '@nestjs/common';
import { PqrSectionController } from './pqr-section.controller';
import { PqrSectionService } from './pqr-section.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PqrSectionController],
  providers: [PqrSectionService],
  exports: [PqrSectionService],
})
export class PqrSectionModule {}
