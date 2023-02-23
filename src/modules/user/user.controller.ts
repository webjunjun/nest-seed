import { Controller, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { WechatRegisterDto } from './dto/wechat-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  @ApiOperation({ summary: '微信小程序登录' })
  @Post('wechat')
  async loginWechatMini(@Body() wechatLogin: WechatLoginDto): Promise<UserEntity & {
    token: string
  }> {
    const wechatData = await this.authService.loginWechatMini(wechatLogin.code);
    let user = null;
    if (wechatLogin.phone) {
      user = await this.userService.findOneByPhone(wechatLogin.phone);
      user.openid = wechatData.openid;
      await this.userRepository.save(user);
    } else {
      user = await this.userService.findOneByOpenid(wechatData.openid);
    }
    if (!user) {
      // 用户不存在跳转小程序注册页面或者获取微信用户信息后再让注册
      throw new HttpException('用户未注册', HttpStatus.UNAUTHORIZED);
    }
    // 用户存在 直接登录
    const tokenNeed = {
      id: user.id,
      phone: user.phone
    }
    const token = await this.authService.createToken(tokenNeed);
    // 更新用户最近登录时间
    user.lastLogin = new Date();
    await this.userRepository.save(user);
    user.password = '';
    return {
      ...user,
      token
    };
  }

  @ApiOperation({summary: '微信小程序注册'})
  @Post('registerWechat')
  async wechatRegister(@Body() user: WechatRegisterDto): Promise<string> {
    await this.userService.registerWechatUser(user);
    return '注册成功';
  }
}
