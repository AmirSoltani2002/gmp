import { Module } from '@nestjs/common';
import { DrugService } from './drug.service';
import { DrugController } from './drug.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports: [DatabaseModule, PersonModule],
  controllers: [DrugController],
  providers: [DrugService],
})
export class DrugModule {}
