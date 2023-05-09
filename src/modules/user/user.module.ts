import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { RedisCacheService } from '../redis/redis-cache.service';

@Module({
  // 在模块操作数据库表时，必须导入ORM包裹的实体类
  imports: [HttpModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  // 涉及其他模块的service层必须注入对应的模块
  providers: [UserService, AuthService, JwtService, RedisCacheService],
  // 暴露本模块的service层 每个导入该模块将会访问同一实例
  exports: [UserService],
})
export class UserModule {}
