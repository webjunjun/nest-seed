// import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 用户表
@Entity('nestjs_user', {
  orderBy: {
    created: 'ASC'
  }
})
export class UserEntity {
  // 标记为主列，值自动生成 实体类必须有至少一个主列
  @PrimaryGeneratedColumn('uuid', { comment: '用户uuid' })
  id: string;

  @Column({ comment: '手机号', length: 16, nullable: false })
  phone: string;

  @Column({ comment: '用户密码', length: 64, nullable: false })
  password: string;

  @Column({ comment: '用户名', length: 16, nullable: true })
  username: string;

  // 指定nanme属性为数据库列里的字段 在系统里就可以使用驼峰命名了
  @Column({ name: 'real_name', comment: '真实姓名', length: 16, nullable: true })
  realName: string;

  @Column({ comment: '微信openid', length: 32, nullable: true })
  openid: string;

  @Column({ comment: '个人简介', length: 255, nullable: true })
  brief: string;

  @Column({ comment: '用户头像', length: 255, nullable: true })
  avatar: string;

  @Column({ name: 'account_status', comment: '账户状态 1: 未注销 -1: 已注销', nullable: false, default: 1 })
  accountStatus: number;

  @Column({ comment: '创建时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ name: 'last_login', comment: '最后登录时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  lastLogin: Date;

  @Column({ name: 'modify_date', comment: '更新信息时间', type: 'timestamp', nullable: true })
  modifyDate: Date;

  @Column({ name: 'update_id', comment: '更新人ID', length: 36, nullable: true })
  updateId: string;

  @Column({ name: 'update_name', comment: '更新人名字', length: 16, nullable: true })
  updateName: string;
}
