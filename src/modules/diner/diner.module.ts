import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinerEntity } from 'src/entity/diner.entity';
import { DinerController } from './diner.controller';
import { DinerService } from './diner.service';

@Module({
  imports: [TypeOrmModule.forFeature([DinerEntity])],
  controllers: [DinerController],
  providers: [DinerService],
  exports: [DinerService],
})
export class DinerModule {}
