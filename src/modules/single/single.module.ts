import { Module } from '@nestjs/common';
import { SingleController } from './single.controller';
import { SingleService } from './single.service';

@Module({
  controllers: [SingleController],
  providers: [SingleService],
  exports: [SingleService],
})
export class SingleModule {}
