import { Module } from '@nestjs/common';
import { DosageService } from './dosage.service';
import { DosageController } from './dosage.controller';

@Module({
  controllers: [DosageController],
  providers: [DosageService],
  exports: [DosageService]
})
export class DosageModule {}
