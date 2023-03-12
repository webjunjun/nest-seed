import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinerItemEntity } from 'src/entity/diner-item.entity';
import { UserEntity } from 'src/entity/user.entity';
import { DinerItemController } from './diner-item.controller';
import { DinerItemService } from './diner-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([DinerItemEntity, UserEntity])],
  controllers: [DinerItemController],
  providers: [DinerItemService],
  exports: [DinerItemService],
})
export class DinerItemModule {}
