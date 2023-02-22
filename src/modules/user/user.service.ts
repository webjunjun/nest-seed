import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { UserEntity } from 'src/entity/user.entity';
import { UserDto } from './dto/user.dto';
import { aes256Encrypt } from 'src/utils/md5encrypt';
import { WechatRegisterDto } from './dto/wechat-register.dto';
import { RegisterCodeEntity } from 'src/entity/register-code.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RegisterCodeEntity)
    private readonly registerCodeRepository: Repository<RegisterCodeEntity>
  ) {}

  // 注册用户
  async registerUser(registerInfo: UserDto): Promise<{
    id: string,
    phone: string
  }> {
    // 数据校验
    const userInfo = await this.userRepository.findOneBy({ phone: registerInfo.phone });
    if (userInfo) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    // 创建用户
    const newUser = await this.userRepository.create(registerInfo);
    // 加密密码
    newUser.password = aes256Encrypt(registerInfo.password);
    const dbUser = await this.userRepository.save(newUser);
    return {
      id: dbUser.id,
      phone: dbUser.phone
    }
  }

  // 注册微信用户
  async registerWechatUser(wechatInfo: WechatRegisterDto): Promise<UserEntity> {
    // 数据校验
    const userInfo = await this.userRepository.findOneBy({ phone: wechatInfo.phone });
    if (userInfo) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    // 校验注册码是否使用
    const codeUsed = await this.registerCodeRepository.findOneBy({code: wechatInfo.registerCode, isUsed: 1})
    if (!codeUsed) {
      throw new HttpException('内部注册码已使用或不存在', HttpStatus.BAD_REQUEST);
    }
    // 更新注册码使用状况
    codeUsed.isUsed = -1;
    codeUsed.useDate = new Date();
    await this.registerCodeRepository.save(codeUsed);
    // 创建用户
    const newUser = await this.userRepository.create(wechatInfo);
    // 加密密码
    newUser.password = aes256Encrypt(wechatInfo.password);
    const dbUser = await this.userRepository.save(newUser);
    dbUser.password = '';
    return dbUser;
  }

  // 根据手机号查询单个用户信息
  async findOneByPhone(phone: string): Promise<UserEntity> {
    if (!phone) {
      throw new HttpException('手机号不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.findOneBy({phone: phone});
  }

  async updateUserLoginDate(phone: string): Promise<void>{
    const userInfo = await this.userRepository.findOneBy({phone: phone});
    userInfo.lastLogin = new Date();
    await this.userRepository.save(userInfo);
  }

  // 根据微信openid查询单个用户
  async findOneByOpenid(openid: string): Promise<UserEntity> {
    if (!openid) {
      throw new HttpException('微信openid不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.findOneBy({openid: openid});
  }
}
