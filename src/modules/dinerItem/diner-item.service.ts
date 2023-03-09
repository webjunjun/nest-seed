import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DinerItemEntity } from 'src/entity/diner-item.entity';
import { InsertResult, Repository } from 'typeorm';
import { DinerItemAddDto } from './dto/diner-item-add.dto';
import { DinerItemDeleteDto } from './dto/diner-item-delete.dto';
import { DinerItemQueryDto } from './dto/diner-item-query.dto';

@Injectable()
export class DinerItemService {
  constructor(
    @InjectRepository(DinerItemEntity)
    private readonly dinerItemRepository: Repository<DinerItemEntity>
  ) {}

  async addOne(singleObject: DinerItemAddDto): Promise<InsertResult> {
    return await this.dinerItemRepository
      .createQueryBuilder()
      .insert()
      .into(DinerItemEntity)
      .values({
        ...singleObject,
        created: new Date()
      })
      .execute();
  }

  async deleteOne(singleObject: DinerItemDeleteDto): Promise<Boolean> {
    await this.dinerItemRepository
      .createQueryBuilder()
      .delete()
      .from(DinerItemEntity)
      .where('id = :id', {id: singleObject.id})
      .execute();
    return true;
  }

  async queryOne(singleObject: DinerItemQueryDto): Promise<DinerItemEntity> {
    return await this.dinerItemRepository
      .createQueryBuilder()
      .select()
      .where("id = :id", { id: singleObject.id })
      .getOne();
  }

  async queryList(singleObject: DinerItemQueryDto): Promise<Array<DinerItemEntity>> {
    const pageSize = singleObject.pageSize ? singleObject.pageSize : 10;
    const currentPage = singleObject.currentPage ? singleObject.currentPage : 1;
    return await this.dinerItemRepository
      .createQueryBuilder('diner_item')
      .select(`
        diner_item.id as id,
        diner_item.diner_id as dinerId,
        diner_item.eater_id as eaterId,
        diner_item.eater as eater,
        diner_item.type as type,
        diner_item.created as created
      `)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('diner_item.created', 'DESC')
      .getRawMany();
  }
}
