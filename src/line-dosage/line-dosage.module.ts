import { Module } from '@nestjs/common';
import { LineDosageService } from './line-dosage.service';
import { LineDosageController } from './line-dosage.controller';
import { LineModule } from 'src/line/line.module';
import { DosageModule } from 'src/dosage/dosage.module';
import { PersonModule } from 'src/person/person.module';

@Module({
  controllers: [LineDosageController],
  providers: [LineDosageService],
  imports: [LineModule, DosageModule, PersonModule],
})
export class LineDosageModule {}
