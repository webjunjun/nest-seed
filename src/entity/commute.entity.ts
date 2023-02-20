import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 出行表
@Entity('wwz_commute', {
  orderBy: {
    created: 'ASC'
  }
})
export class CommuteEntity {
  @PrimaryGeneratedColumn('increment', {comment: '出行ID'})
  id: number;

  @Column({name: 'license_plate', comment: '车牌号', length: 8, nullable: true})
  licensePlate: string;

  @Column({name: 'start_addr', comment: '开始地点', length: 32, nullable: true})
  startAddr: string;

  @Column({name: 'end_addr', comment: '结束地点', length: 32, nullable: true})
  endAddr: string;

  @Column({name: 'pass_addr', comment: '途径地点', type: 'text', nullable: true})
  passAddr: Array<string>;

  @Column({comment: '座位', type: 'tinyint', nullable: true})
  seat: number;

  @Column({name: 'commute_date', comment: '出行时间', type: 'timestamp', nullable: true})
  commuteDate: Date;

  @Column({comment: '创建时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  @Column({name: 'created_id', comment: '创建人ID', length: 36, nullable: true})
  createdId: string;

  @Column({name: 'created_name', comment: '创建人名字', length: 16, nullable: true})
  createdName: string;

  @Column({name: 'last_modify', comment: '最后修改时间', type: 'timestamp', nullable: true})
  lastModify: Date;

  @Column({name: 'update_id', comment: '更新人ID', length: 36, nullable: true})
  updateId: string;

  @Column({name: 'update_name', comment: '更新人名字', length: 16, nullable: true})
  updateName: string;
}
