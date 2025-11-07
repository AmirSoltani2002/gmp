import { Module } from '@nestjs/common';
import { PqrItemController } from './pqr-item.controller';
import { PqrItemService } from './pqr-item.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PqrItemController],
  providers: [PqrItemService],
  exports: [PqrItemService],
})
export class PqrItemModule {}
