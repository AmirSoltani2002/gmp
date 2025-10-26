import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { SiteModule } from 'src/site/site.module';
import { PersonModule } from 'src/person/person.module';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [SiteModule, PersonModule],
  exports: [LineService]
})
export class LineModule {}
