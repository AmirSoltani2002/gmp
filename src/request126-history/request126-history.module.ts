import { Module } from '@nestjs/common';
import { Request126HistoryController } from './request126-history.controller';
import { Request126HistoryService } from './request126-history.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [Request126HistoryController],
  providers: [Request126HistoryService],
  exports: [Request126HistoryService], // Export for use in other modules
})
export class Request126HistoryModule {}