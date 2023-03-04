import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommuteItemEntity } from 'src/entity/commute-item.entity';
import { CommuteEntity } from 'src/entity/commute.entity';
import { RegisterCodeEntity } from 'src/entity/register-code.entity';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from '../user/user.service';
import { CommuteController } from './commute.controller';
import { CommuteService } from './commute.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommuteEntity, CommuteItemEntity, UserEntity, RegisterCodeEntity])],
  controllers: [CommuteController],
  providers: [CommuteService, UserService],
  exports: [CommuteService],
})
export class CommuteModule {}
