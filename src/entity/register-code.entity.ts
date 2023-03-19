import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 注册码表
@Entity('wwz_register_code', {
  orderBy: {
    created: 'ASC'
  }
})
export class RegisterCodeEntity {
  @PrimaryGeneratedColumn('increment', {comment: '内部注册码ID'})
  id: number;

  @Column({comment: '内部注册码', length: 8, nullable: false})
  code: string;

  @Column({name: 'is_used', comment: '是否使用 1: 未使用 -1: 已使用', nullable: false, default: 1})
  isUsed: number;

  @Column({name: 'use_name', comment: '使用者', length: 16, nullable: true, default: null})
  useName: string;

  @Column({name: 'use_date', comment: '使用时间', type: 'timestamp', nullable: true, default: null})
  useDate: Date;

  @Column({comment: '创建时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
}
