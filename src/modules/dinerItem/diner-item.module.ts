import { Module } from '@nestjs/common';
import { DinerItemController } from './diner-item.controller';
import { DinerItemService } from './diner-item.service';

@Module({
  controllers: [DinerItemController],
  providers: [DinerItemService],
  exports: [DinerItemService],
})
export class DinerItemModule {}
