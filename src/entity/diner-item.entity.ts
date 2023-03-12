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

  @Column({name: 'diner_date', type: 'date', comment: '就餐日期', nullable: true})
  dinerDate: Date;

  @Column({comment: '是否早餐 -1否/1是', type: 'tinyint', nullable: true, default: -1})
  morning: number;
  
  @Column({comment: '是否中餐 -1否/1是', type: 'tinyint', nullable: true, default: -1})
  midday: number;

  @Column({comment: '是否晚餐 -1否/1是', type: 'tinyint', nullable: true, default: -1})
  evening: number;

  @Column({name: 'eater_id', comment: '就餐人ID', length: 36, nullable: true})
  eaterId: string;

  @Column({comment: '就餐人', length: 16, nullable: true})
  eater: string;

  @Column({comment: '类型 早餐/中餐/晚餐', length: 8, nullable: true})
  type: string;

  @Column({comment: '创建时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
}
