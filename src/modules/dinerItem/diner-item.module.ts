import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinerItemEntity } from 'src/entity/diner-item.entity';
import { UserEntity } from 'src/entity/user.entity';
import { VisitorDinerEntity } from 'src/entity/visitor-diner.entity';
import { DinerItemController } from './diner-item.controller';
import { DinerItemService } from './diner-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([DinerItemEntity, UserEntity, VisitorDinerEntity])],
  controllers: [DinerItemController],
  providers: [DinerItemService],
  exports: [DinerItemService],
})
export class DinerItemModule {}
