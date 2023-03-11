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

  @Column({name: 'morning_start', comment: '早餐开始时间', length: 16, nullable: true})
  morningStart: string;

  @Column({name: 'morning_end', comment: '早餐结束时间', length: 16, nullable: true})
  morningEnd: string;

  @Column({name: 'midday_start', comment: '午餐开始时间', length: 16, nullable: true})
  middayStart: string;

  @Column({name: 'midday_end', comment: '午餐结束时间', length: 16, nullable: true})
  middayEnd: string;

  @Column({name: 'evening_start', comment: '晚餐开始时间', length: 16, nullable: true})
  eveningStart: string;

  @Column({name: 'evening_end', comment: '晚餐结束时间', length: 16, nullable: true})
  eveningEnd: string;

  @Column({comment: '就餐类型 来客/三餐', length: 8, nullable: true})
  type: string;

  @Column({name: 'booking_start', type: 'datetime', comment: '预约开始时间', nullable: true})
  bookingStart: Date;

  @Column({name: 'booking_end', type: 'datetime', comment: '预约结束时间', nullable: true})
  bookingEnd: Date;

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
