import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ParsedQs } from 'qs';
import { RedisCacheService } from 'src/modules/redis/redis-cache.service';
import { UserService } from 'src/modules/user/user.service'
import { NestSeedConstants } from 'src/utils/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: NestSeedConstants.secret,
      passReqToCallback: true // 为true下面的validate才会有req
    });
  }

  // 请求需要登录才能访问的接口，校验token成功走这里
  async validate(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, payload: any) {
    const tokenKey = `${payload.phone}&${payload.id}`;
    let cacheToken = await this.redisCacheService.cacheGet(tokenKey);
    if (!cacheToken) {
      // 非小程序直接提示失效
      // throw new HttpException('登录已失效', HttpStatus.BAD_REQUEST);
      // 小程序在这里就再次登录
      const reLoginToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      if (!reLoginToken) {
        throw new HttpException('登录已失效', HttpStatus.BAD_REQUEST);
      }
      this.redisCacheService.cacheSet(
        tokenKey,
        reLoginToken,
        1800
      );
      cacheToken = reLoginToken;
    }
    const urlToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (urlToken !== cacheToken) {
      throw new HttpException('用户已在其他设备登录', HttpStatus.BAD_REQUEST);
    }
    // payload里是id、phone、iat
    const existUser = await this.userService.findOneByPhone(payload.phone);
    if (!existUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const tokenTime = await this.redisCacheService.cacheTtlGet(tokenKey);
    if (tokenTime <= 300) {
      // 过期时间剩余300秒时，刷新token
      this.redisCacheService.cacheSet(
        tokenKey,
        urlToken,
        1800
      );
    }
    // 数据塞在@Req() request里 路由通过request.user获取
    return { id: payload.id, phone: payload.phone };
  }
}
