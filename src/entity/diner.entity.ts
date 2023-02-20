import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 就餐预约设置表
@Entity('wwz_dinner', {
  orderBy: {
    created: 'ASC'
  }
})
export class DinerEntity {
  @PrimaryGeneratedColumn('increment', {comment: '就餐预约ID'})
  id: number;

  @Column({name: 'eat_date', comment: '就餐日期', type: 'date', nullable: true})
  eatDate: Date;

  @Column({name: 'eat_time', comment: '就餐时间段', length: 16, nullable: true})
  eatTime: string;

  @Column({name: 'eat_type', comment: '就餐类型 早餐/中餐/晚餐', length: 8, nullable: true})
  eatType: string;

  @Column({name: 'booking_date', comment: '可预约时间段', length: 16, nullable: true})
  bookingDate: string;

  @Column({comment: '类型 来客/三餐', length: 8, nullable: true})
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
