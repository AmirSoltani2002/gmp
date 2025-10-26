import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PersonModule } from 'src/person/person.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [PersonModule],
})
export class ContactModule {}
