import { Module } from '@nestjs/common';
import { DinerController } from './diner.controller';
import { DinerService } from './diner.service';

@Module({
  controllers: [DinerController],
  providers: [DinerService],
  exports: [DinerService],
})
export class DinerModule {}
