import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterCodeEntity } from 'src/entity/register-code.entity';
import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegisterCodeEntity])],
  controllers: [CodesController],
  providers: [CodesService],
  exports: [CodesService],
})
export class CodesModule {}
