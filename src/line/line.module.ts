import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { SiteModule } from 'src/site/site.module';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [SiteModule],
  exports: [LineService]
})
export class LineModule {}
