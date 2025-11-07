import { Module } from '@nestjs/common';
import { InspectionInspectorController } from './inspection-inspector.controller';
import { InspectionInspectorService } from './inspection-inspector.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InspectionInspectorController],
  providers: [InspectionInspectorService],
  exports: [InspectionInspectorService],
})
export class InspectionInspectorModule {}
