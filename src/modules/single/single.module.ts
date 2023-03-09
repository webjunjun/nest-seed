import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RichTextEntity } from 'src/entity/rich-text.entity';
import { SingleController } from './single.controller';
import { SingleService } from './single.service';

@Module({
  imports: [TypeOrmModule.forFeature([RichTextEntity])],
  controllers: [SingleController],
  providers: [SingleService],
  exports: [SingleService],
})
export class SingleModule {}
