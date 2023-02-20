import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 出行人明细表
@Entity('wwz_commute_item', {
  orderBy: {
    created: 'ASC'
  }
})
export class CommuteItemEntity {
  @PrimaryGeneratedColumn('increment', {comment: '出行明细ID'})
  id: number;

  @Column({name: 'commute_id', comment: '出行ID', nullable: true})
  commuteId: number;

  @Column({name: 'traveler_id', comment: '出行人ID', length: 36, nullable: true})
  travelerId: string;

  @Column({comment: '出行人', length: 16, nullable: true})
  traveler: string;

  @Column({comment: '出行类型 发布/拼车',length: 8, nullable: true})
  type: string;

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
