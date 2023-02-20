import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 来客就餐记录表
@Entity('wwz_visitor_diner', {
  orderBy: {
    created: 'ASC'
  }
})
export class VisitorDinerEntity {
  @PrimaryGeneratedColumn('increment', {comment: '来客就餐记录ID'})
  id: number;

  @Column({name: 'booker_id', comment: '预约人ID', length: 36, nullable: true})
  bookerId: string;

  @Column({name: 'booker_name', comment: '预约人名字', length: 16, nullable: true})
  bookerName: string;

  @Column({name: 'diner_num', comment: '就餐人数', nullable: true})
  dinerNum: number;

  @Column({name: 'diner_date', type: 'timestamp', comment: '就餐时间', nullable: true})
  dinerDate: Date;

  @Column({name: 'visitor_company', comment: '来客单位', length: 32, nullable: true})
  visitorCompany: string;

  @Column({name: 'visitor_level', comment: '来客级别', length: 8, nullable: true})
  visitorLevel: string;

  @Column({comment: '备注', length: 255, nullable: true})
  remark: string;

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