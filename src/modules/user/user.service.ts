import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { UserEntity } from 'src/entity/user.entity';
import { UserDto } from './dto/user.dto';
import { aes256Encrypt } from 'src/utils/md5encrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  // 注册用户
  async registerUser(registerInfo: UserDto): Promise<{
    id: string,
    username: string
  }> {
    // 数据校验
    const userInfo = await this.userRepository.findOneBy({ username: registerInfo.username });
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
      username: dbUser.username
    }
  }

  // 根据用户名查询单个用户信息
  async findOneByUsername(username: string): Promise<UserEntity> {
    if (!username) {
      throw new HttpException('用户名不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.findOneBy({username: username});
  }

  // 根据微信openid查询单个用户
  async findOneByOpenid(openid: string): Promise<UserEntity> {
    if (!openid) {
      throw new HttpException('微信openid不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.findOneBy({openid: openid});
  }
}
