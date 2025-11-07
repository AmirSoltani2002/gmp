import { Module } from '@nestjs/common';
import { InspectionController } from './inspection.controller';
import { InspectionService } from './inspection.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InspectionController],
  providers: [InspectionService],
  exports: [InspectionService],
})
export class InspectionModule {}
