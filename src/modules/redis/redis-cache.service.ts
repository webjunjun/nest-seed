import { Injectable, Inject, CACHE_MANAGER, HttpException, HttpStatus } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async cacheSet(key: string, value: string, ttl: number) {
    // ttl设置为0，缓存永不过期 默认是5秒 单位是秒
    // 解决时间设置不生效
    // https://github.com/dabroek/node-cache-manager-redis-store/issues/40
    this.cacheManager.set(key, value, { ttl } as any).catch((e) => {
      throw new HttpException('缓存设置失败', HttpStatus.BAD_REQUEST);
    });
  }

  async cacheGet(key: string): Promise<any> {
    return this.cacheManager.get(key).catch((e) => {
      throw new HttpException('缓存获取失败', HttpStatus.BAD_REQUEST);
    });
  }

  async cacheTtlGet(key: string): Promise<number> {
    return this.cacheManager.store.ttl(key).catch((e) => {
      throw new HttpException('缓存获取失败', HttpStatus.BAD_REQUEST);
    });
  }
}
