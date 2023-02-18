import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, IStrategyOptions } from 'passport-local';
import { Repository } from 'typeorm'
import { UserEntity } from 'src/entity/user.entity';
import { aes256Decrypt } from 'src/utils/md5encrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    // super里的参数可省略
    // super()
    // 如果用户名是email usernameField的值就是email
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  // 本地身份认证
  async validate(username: string, password: string): Promise<{
    id: string,
    username: string
  }> {
    const userInfo = await this.userRepository.findOneBy({ username: username });
    if (!userInfo) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    // 解密密码
    const decryptPassword = aes256Decrypt(password, userInfo.password);
    if (decryptPassword !== password) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    // 返回给请求的controller
    return {
      id: userInfo.id,
      username: userInfo.username
    };
  }
}
