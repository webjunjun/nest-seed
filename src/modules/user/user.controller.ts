import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from './user.service';
import { AuthService } from 'src/modules/auth/auth.service';
import { LocalAuthGuard } from 'src/modules/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Http2ServerRequest } from 'http2';
import { WechatLoginDto } from './dto/wechat-login.dto';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @ApiOperation({summary: '用户注册'})
  @Post('register')
  userRegister(@Body() user: UserDto): Promise<{
    id: string,
    phone: string
  }> {
    return this.userService.registerUser(user);
  }

  @ApiOperation({summary: 'web用户登录'})
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async userLogin(@Body() user: UserDto, @Req() request: Http2ServerRequest & {
    user: {
      id: string,
      phone: string
    }
  } ): Promise<string> {
    // 更新最后登录时间
    await this.userService.updateUserLoginDate(request.user.phone);
    return this.authService.createToken(request.user);
  }

  @ApiOperation({ summary: '微信小程序登录' })
  @Post('wechat')
  async loginWechatMini(@Body() wechatLogin: WechatLoginDto) {
    const wechatData = await this.authService.loginWechatMini(wechatLogin.code);
    const user = await this.userService.findOneByOpenid(wechatData.openid);
    if (!user) {
      // 用户不存在跳转小程序注册页面或者获取微信用户信息后再让注册
      return wechatData;
    }
    // 用户存在 直接登录
    const tokenNeed = {
      id: user.id,
      phone: user.phone
    }
    return this.authService.createToken(tokenNeed);
  }

  @ApiOperation({summary: '获取用户信息'})
  @UseGuards(JwtAuthGuard)
  @Post('info')
  getUserInfo(@Body() user: {
    phone: string
  }): Promise<UserEntity> {
    return this.userService.findOneByPhone(user.phone);
  }
}
