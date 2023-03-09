// import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 用户表
@Entity('wwz_user', {
  orderBy: {
    created: 'ASC'
  }
})
export class UserEntity {
  // 标记为主列，值自动生成 实体类必须有至少一个主列
  @PrimaryGeneratedColumn('uuid', {comment: '用户uuid'})
  id: string;

  @Column({comment: '手机号', length: 16, nullable: false})
  phone: string;

  @Column({comment: '用户密码', length: 64, nullable: false})
  password: string;

  @Column({comment: '用户名', length: 16, nullable: true})
  username: string;

  @Column({name: 'real_name', comment: '真实姓名', length: 16, nullable: true})
  realName: string;

  @Column({comment: '微信openid', length: 32, nullable: true})
  openid: string;

  @Column({comment: '个人简介', length: 255, nullable: true})
  brief: string;

  @Column({comment: '用户头像', length: 255, nullable: true})
  avatar: string;

  @Column({name: 'license_plate', comment: '车牌号', length: 8, nullable: true})
  licensePlate: string;

  @Column({comment: '角色', type: 'tinyint', nullable: true})
  role: number;

  @Column({name: 'role_name', comment: '角色名称', length: 8, nullable: true})
  roleName: string;

  @Column({name: 'register_code', comment: '注册码', length: 8, nullable: true})
  registerCode: string;

  @Column({comment: '创建时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  // 指定nanme属性为数据库列里的字段 在系统里就可以使用驼峰命名了
  @Column({name: 'last_login', comment: '最后登录时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  lastLogin: Date;

  @Column({name: 'modify_date', comment: '更新信息时间', type: 'timestamp', nullable: true})
  modifyDate: Date;

  @Column({name: 'update_id', comment: '更新人ID', length: 36, nullable: true})
  updateId: string;

  @Column({name: 'update_name', comment: '更新人名字', length: 16, nullable: true})
  updateName: string;
}
