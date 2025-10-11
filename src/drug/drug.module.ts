import { Module } from '@nestjs/common';
import { DrugService } from './drug.service';
import { DrugController } from './drug.controller';

@Module({
  controllers: [DrugController],
  providers: [DrugService],
})
export class DrugModule {}
