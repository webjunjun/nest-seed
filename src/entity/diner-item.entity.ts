import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 个人就餐明细表
@Entity('wwz_diner_item', {
  orderBy: {
    created: 'ASC'
  }
})
export class DinerItemEntity {
  @PrimaryGeneratedColumn('increment', {comment: '就餐明细ID'})
  id: number;

  @Column({name: 'diner_id', comment: '就餐预约ID', nullable: true})
  dinerId: number;

  @Column({name: 'eater_id', comment: '就餐人ID', length: 36, nullable: true})
  eaterId: string;

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
