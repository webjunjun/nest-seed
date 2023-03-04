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

  @Column({name: 'commute_date', comment: '出行时间', type: 'timestamp', nullable: true})
  commuteDate: Date;

  @Column({comment: '创建时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
}
