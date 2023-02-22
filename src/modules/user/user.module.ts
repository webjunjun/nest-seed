import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { RedisCacheService } from '../redis/redis-cache.service';
import { RegisterCodeEntity } from 'src/entity/register-code.entity';

@Module({
  // 在模块操作数据库表时，必须导入ORM包裹的实体类
  imports: [HttpModule, TypeOrmModule.forFeature([UserEntity, RegisterCodeEntity])],
  controllers: [UserController],
  // 涉及其他模块的service层必须注入对应的模块
  providers: [UserService, AuthService, JwtService, RedisCacheService],
  // 暴露本模块的service层
  exports: [UserService],
})
export class UserModule {}
