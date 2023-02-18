import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';
import { CacheModule, Module } from '@nestjs/common';
// redis 引入问题解决办法 https://github.com/dabroek/node-cache-manager-redis-store/issues/53
const redisStore = require('cache-manager-redis-store').redisStore;

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get<string>('REDIS_HOST'), // 地址
          port: configService.get<number>('REDIS_PORT'), // 端口号
          db: configService.get<number>('REDIS_DB'), // 目标库,
          auth_pass:  configService.get<string>('REDIS_PASSPORT') // 密码,没有可以不写
        };
      }
    })
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
