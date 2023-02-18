// import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 指定表名为user 否则表名是UserEntity
@Entity('user')
export class UserEntity {
  // 标记为主列，值自动生成 实体类必须有至少一个主列
  @PrimaryGeneratedColumn('uuid', {comment: '用户uuid'})
  id: string;

  @Column({comment: '用户名', length: 64, nullable: false})
  username: string;

  @Column({comment: '微信openid', length: 64, nullable: true})
  openid: string;

  @Column({name: 'real_name', comment: '真实姓名', length: 64, nullable: true})
  realName: string;

  @Column({comment: '性别', length: 16, nullable: true})
  gender: string;

  @Column({comment: '个人简介', length: 255, nullable: true})
  brief: string;

  @Column({comment: '用户头像', length: 255, nullable: true})
  avatar: string;

  @Column({comment: '手机号', length: 64, nullable: true})
  phone: string;

  @Column({comment: '用户邮箱', length: 255, nullable: true})
  email: string;

  // 过滤密码
  // @Exclude()
  @Column({comment: '用户密码', length: 255, nullable: false})
  password: string;

  @Column({comment: '账号状态 1: 未注销, -1: 已注销', type: 'tinyint', nullable: false, default: 1})
  status: number;

  @Column({comment: '创建时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  // 指定nanme属性为数据库列里的字段 在系统里就可以使用驼峰命名了
  @Column({name: 'last_login', comment: '最后登录时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  lastLogin: Date;
}
