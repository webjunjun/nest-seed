import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { UserEntity } from 'src/entity/user.entity';
import { aes256Encrypt } from 'src/utils/md5encrypt';
import { WechatRegisterDto } from './dto/wechat-register.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserDeleteDto } from './dto/user-delete.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  // 注册微信用户
  async registerWechatUser(wechatInfo: WechatRegisterDto): Promise<UserEntity> {
    // 数据校验
    const userInfo = await this.userRepository.findOneBy({ phone: wechatInfo.phone });
    if (userInfo) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
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

  // 根据微信openid查询单个用户
  async findOneByOpenid(openid: string): Promise<UserEntity> {
    if (!openid) {
      throw new HttpException('微信openid不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.findOneBy({openid: openid});
  }

  async queryList(singleObject: UserQueryDto): Promise<Array<UserEntity>> {
    const pageSize = singleObject.pageSize ? singleObject.pageSize : 10;
    const currentPage = singleObject.currentPage ? singleObject.currentPage : 1;
    return await this.userRepository
      .createQueryBuilder('user')
      .select(`
        user.id as id,
        user.phone as phone,
        user.real_name as realName,
        user.created as created
      `)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('user.created', 'DESC')
      .getRawMany();
  }

  async deleteOne(singleObject: UserDeleteDto): Promise<Boolean> {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('id = :id', {id: singleObject.id})
      .execute();
    return true;
  }
}
