import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 理发表
@Entity('wwz_haircut', {
  orderBy: {
    created: 'ASC'
  }
})
export class HaircutEntity {
  @PrimaryGeneratedColumn('increment', {comment: '理发下单ID'})
  id: number;

  @Column({name: 'haircut_id', comment: '预约理发人ID', length: 36, nullable: true})
  haircutId: string;

  @Column({name: 'haircut_name', comment: '预约理发人', length: 16, nullable: true})
  haircutName: string;

  // 周一
  @Column({name: 'haircut_start', type: 'timestamp', comment: '本周理发开始日期', nullable: true})
  haircutStart: Date;

  // 周五
  @Column({name: 'haircut_end', type: 'timestamp', comment: '本周理发结束日期', nullable: true})
  haircutEnd: Date;

  @Column({comment: '创建时间', type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
}
