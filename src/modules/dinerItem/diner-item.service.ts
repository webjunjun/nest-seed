import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DinerItemEntity } from 'src/entity/diner-item.entity';
import { UserEntity } from 'src/entity/user.entity';
import { getDateStr } from 'src/utils/utils';
import { Repository } from 'typeorm';
import { DinerItemAddDto } from './dto/diner-item-add.dto';
import { DinerItemDeleteDto } from './dto/diner-item-delete.dto';
import { DinerItemQueryDto } from './dto/diner-item-query.dto';

@Injectable()
export class DinerItemService {
  constructor(
    @InjectRepository(DinerItemEntity)
    private readonly dinerItemRepository: Repository<DinerItemEntity>
  ) {}

  async addOne(singleObject: DinerItemAddDto): Promise<{
    today: DinerItemEntity,
    tomorrow: DinerItemEntity
  }> {
    await this.dinerItemRepository
      .createQueryBuilder()
      .insert()
      .into(DinerItemEntity)
      .values({
        ...singleObject,
        created: new Date()
      })
      .execute();
    return await this.queryTwodays(singleObject.eaterId);
  }

  async modifyOne(singleObject: DinerItemAddDto): Promise<{
    today: DinerItemEntity,
    tomorrow: DinerItemEntity
  }> {
    const result = await this.dinerItemRepository
      .createQueryBuilder()
      .update(DinerItemEntity)
      .set(singleObject)
      .where('id = :id', {id: singleObject.id})
      .execute();
    if (result) {
      // 查看是否全是-1
      const lateResult = await this.dinerItemRepository
      .createQueryBuilder()
      .select()
      .where(
        'id = :id',
        {id: singleObject.id}
      )
      .orderBy('created', 'DESC')
      .getOne();
      if (lateResult.morning === -1 && lateResult.midday === -1 && lateResult.evening === -1) {
        await this.deleteOne(singleObject);
      }
    }
    return await this.queryTwodays(singleObject.eaterId);
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

  async queryList(singleObject: DinerItemQueryDto): Promise<Array<DinerItemEntity>> {
    const pageSize = singleObject.pageSize ? singleObject.pageSize : 10;
    const currentPage = singleObject.currentPage ? singleObject.currentPage : 1;
    return await this.dinerItemRepository
      .createQueryBuilder('diner_item')
      .select(`
        diner_item.id as id,
        diner_item.diner_id as dinerId,
        diner_item.diner_date as dinerDate,
        diner_item.morning as morning,
        diner_item.midday as midday,
        diner_item.evening as evening,
        diner_item.eater_id as eaterId,
        diner_item.eater as eater,
        diner_item.type as type,
        diner_item.created as created
      `)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('diner_item.created', 'DESC')
      .where('eater_id = :eaterId', {eaterId: singleObject.eaterId})
      .getRawMany();
  }

  async queryAllList(singleObject: DinerItemQueryDto): Promise<Array<DinerItemEntity>> {
    const pageSize = singleObject.pageSize ? singleObject.pageSize : 10;
    const currentPage = singleObject.currentPage ? singleObject.currentPage : 1;
    return await this.dinerItemRepository
      .createQueryBuilder('diner_item')
      .leftJoinAndSelect(UserEntity, 'user', 'user.id = diner_item.eaterId')
      .select(`
        diner_item.id as id,
        diner_item.diner_id as dinerId,
        diner_item.diner_date as dinerDate,
        diner_item.morning as morning,
        diner_item.midday as midday,
        diner_item.evening as evening,
        diner_item.eater_id as eaterId,
        diner_item.eater as eater,
        diner_item.type as type,
        diner_item.created as created,
        user.avatar as avatar,
        user.phone as phone
      `)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('diner_item.created', 'DESC')
      .getRawMany();
  }

  async queryTwodays(id: string): Promise<{
    today: DinerItemEntity,
    tomorrow: DinerItemEntity
  }> {
    const searchTomorrow = getDateStr(1)
    const searchToday = getDateStr(0)
    const result1 = await this.dinerItemRepository
      .createQueryBuilder()
      .select()
      .where(
        'eater_id = :id and diner_date = :searchToday',
        {id, searchToday}
      )
      .orderBy('created', 'DESC')
      .getOne();
    const result2 = await this.dinerItemRepository
      .createQueryBuilder()
      .select()
      .where(
        'eater_id = :id and diner_date = :searchTomorrow',
        {id, searchTomorrow}
      )
      .orderBy('created', 'DESC')
      .getOne();
    return {
      today: result1,
      tomorrow: result2
    }
  }
}
