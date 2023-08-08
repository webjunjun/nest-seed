import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError, firstValueFrom, map } from 'rxjs';
import { WechatRequest, WechatResponse } from 'src/type/nestSeed';
import { NestSeedConstants } from 'src/utils/constants';
import { RedisCacheService } from '../redis/redis-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly redisCacheService: RedisCacheService
  ) {}

  // 生成access_token
  async createToken(user: {
    id: string,
    phone: string
  }): Promise<string> {
    const payload = { id: user.id, phone: user.phone };
    const token = await this.jwtService.signAsync(payload, { secret: NestSeedConstants.secret });
    // token保存到redis里
    this.redisCacheService.cacheSet(
      `WWZBOOKING:${user.phone}&${user.id}`,
      token,
      1800
    )
    return token;
  }

  // 微信小程序登录
  async loginWechatMini(code: string): Promise<Partial<WechatResponse>> {
    const { appid, appsecret } = NestSeedConstants;
    const wechatCode = code;
    if (!wechatCode) {
      throw new HttpException('微信授权码丢失', HttpStatus.BAD_REQUEST)
    }
    if (!appid) {
      throw new HttpException('微信ID丢失', HttpStatus.BAD_REQUEST)
    }
    if (!appsecret) {
      throw new HttpException('微信密钥丢失', HttpStatus.BAD_REQUEST)
    }
    const params: Required<WechatRequest> = {
      appid,
      secret: appsecret,
      grant_type: 'authorization_code',
      js_code: code
    }
    const res: Partial<WechatResponse> = await firstValueFrom(
      this.httpService
        .get(NestSeedConstants.wechatHost + 'sns/jscode2session', { params })
        .pipe(
          map(response => response.data),
          catchError(e => {
            throw new HttpException('微信openid获取失败', HttpStatus.BAD_REQUEST);
          })
        )
    )
    if (res.errcode || res.errcode === -1) {
      let msg = '';
      switch (res.errcode) {
        case 40029:
          msg = '微信授权码code无效';
          break;
        case 45011:
          msg = 'API调用太频繁, 请稍候再试';
          break;
        case 40226:
          msg = '微信小程序官方登录拒绝';
          break;
        case -1:
          msg = '系统繁忙, 请稍候再试';
          break;
        default:
          msg = '系统繁忙, 请联系管理员';
          break;
      }
      throw new HttpException(msg, HttpStatus.BAD_REQUEST);
    }
    // 返回微信的openid、session_key
    return res;
  }
}
