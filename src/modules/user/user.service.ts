import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { UserEntity } from 'src/entity/user.entity';
import { aes256Encrypt } from 'src/utils/md5encrypt';
import { WechatRegisterDto } from './dto/wechat-register.dto';
import { RegisterCodeEntity } from 'src/entity/register-code.entity';
import { UserUpdateDto } from './dto/user-update.dto';
import { ModifyUserLicensePlate } from 'src/type/nestSeed';
import { UserQueryDto } from './dto/user-query.dto';
import { UserDeleteDto } from './dto/user-delete.dto';
import { UserRoleDto } from './dto/user-role.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RegisterCodeEntity)
    private readonly registerCodeRepository: Repository<RegisterCodeEntity>
  ) {}

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
    // 默认是用户
    newUser.role = 1;
    newUser.roleName = '用户';
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

  // 保存用户修改
  async updateUserData(userInfo: UserUpdateDto): Promise<UserEntity> {
    const curUser = await this.userRepository.findOneBy({id: userInfo.id});
    Object.assign(curUser, userInfo);
    curUser.modifyDate = new Date();
    return this.userRepository.save(curUser);
  }

  // 发布出行时更新车牌号
  async updateLicensePlateById(userData: ModifyUserLicensePlate): Promise<string> {
    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        licensePlate: userData.licensePlate,
        updateId: userData.updateId,
        updateName: userData.updateName,
        modifyDate: new Date()
      })
      .where('id = :id', {id: userData.userId})
      .execute();
    return 'ok'
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
        user.license_plate as licensePlate,
        user.role as role,
        user.role_name as roleName,
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

  async setUserRole(singleObject: UserRoleDto): Promise<Boolean> {
    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        role: singleObject.role,
        roleName: singleObject.roleName,
        updateId: singleObject.updateId,
        updateName: singleObject.updateName,
        modifyDate: new Date()
      })
      .where('id = :id', {id: singleObject.id})
      .execute();
    return true;
  }
}
