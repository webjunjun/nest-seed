import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 单页图文表
@Entity('wwz_rich_text', {
  orderBy: {
    created: 'ASC'
  }
})
export class RichTextEntity {
  @PrimaryGeneratedColumn('increment', {comment: '单页面ID'})
  id: number;

  @Column({comment: '类型 本周食谱: 0/帮助: 1/关于我们: 2', nullable: true})
  type: number;

  @Column({comment: '标题', length: 32, nullable: true})
  title: string;

  @Column({comment: '简介', length: 255, nullable: true})
  desc: string;

  @Column({comment: '内容', type: 'text', nullable: true})
  content: string;

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
