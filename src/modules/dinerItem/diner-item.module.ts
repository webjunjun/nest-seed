import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinerItemEntity } from 'src/entity/diner-item.entity';
import { DinerItemController } from './diner-item.controller';
import { DinerItemService } from './diner-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([DinerItemEntity])],
  controllers: [DinerItemController],
  providers: [DinerItemService],
  exports: [DinerItemService],
})
export class DinerItemModule {}
