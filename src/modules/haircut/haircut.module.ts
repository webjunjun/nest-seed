import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HaircutEntity } from 'src/entity/haircut.entity';
import { HaircutController } from './haircut.controller';
import { HaircutService } from './haircut.service';

@Module({
  imports: [TypeOrmModule.forFeature([HaircutEntity])],
  controllers: [HaircutController],
  providers: [HaircutService],
  exports: [HaircutService],
})
export class HaircutModule {}
