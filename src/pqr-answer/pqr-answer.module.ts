import { Module } from '@nestjs/common';
import { PqrAnswerController } from './pqr-answer.controller';
import { PqrAnswerService } from './pqr-answer.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PqrAnswerController],
  providers: [PqrAnswerService],
  exports: [PqrAnswerService],
})
export class PqrAnswerModule {}
