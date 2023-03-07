import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorDinerEntity } from 'src/entity/visitor-diner.entity';
import { VisitorDinerController } from './diner.controller';
import { VisitorDinerService } from './diner.service';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorDinerEntity])],
  controllers: [VisitorDinerController],
  providers: [VisitorDinerService],
  exports: [VisitorDinerService],
})
export class VisitorDinerModule {}
