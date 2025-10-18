import { Module } from '@nestjs/common';
import { Request126Controller } from './request126.controller';
import { Request126Service } from './request126.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [Request126Controller],
  providers: [Request126Service],
})
export class Request126Module {}
