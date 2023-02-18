import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user/user.module';
import { AuthService } from './auth.service';
import { NestSeedConstants } from 'src/utils/constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { RedisCacheService } from '../redis/redis-cache.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: NestSeedConstants.secret,
      // signOptions: { expiresIn: '30m' }, // JWT生成的token过期时间 因使用redis实现token自动续期，这里需取消限制
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, HttpService, {
    provide: 'AXIOS_INSTANCE_TOKEN',
    useValue: axios
  }, RedisCacheService],
  exports: [AuthService],
})
export class AuthModule {}
