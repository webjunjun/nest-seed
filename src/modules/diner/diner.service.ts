import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DinerEntity } from 'src/entity/diner.entity';
import { getDateStr } from 'src/utils/utils';
import { InsertResult, Repository } from 'typeorm';
import { DinerAddDto } from './dto/diner-add.dto';
import { DinerDeleteDto } from './dto/diner-delete.dto';
import { DinerEditDto } from './dto/diner-edit.dto';
import { DinerQueryDto } from './dto/diner-query.dto';

@Injectable()
export class DinerService {
  constructor(
    @InjectRepository(DinerEntity)
    private readonly dinerRepository: Repository<DinerEntity>
  ) {}

  async addOne(singleObject: DinerAddDto): Promise<InsertResult> {
    return await this.dinerRepository
      .createQueryBuilder()
      .insert()
      .into(DinerEntity)
      .values(singleObject)
      .execute();
  }

  async modifyOne(singleObject: DinerEditDto): Promise<Boolean> {
    await this.dinerRepository
      .createQueryBuilder()
      .update(DinerEntity)
      .set(singleObject)
      .where('id = :id', {id: singleObject.id})
      .execute();
    return true;
  }

  async deleteOne(singleObject: DinerDeleteDto): Promise<Boolean> {
    await this.dinerRepository
      .createQueryBuilder()
      .delete()
      .from(DinerEntity)
      .where('id = :id', {id: singleObject.id})
      .execute();
    return true;
  }

  async queryOne(singleObject: DinerQueryDto): Promise<DinerEntity> {
    return await this.dinerRepository
      .createQueryBuilder()
      .select()
      .where("id = :id", { id: singleObject.id })
      .getOne();
  }

  async queryList(singleObject: DinerQueryDto): Promise<Array<DinerEntity>> {
    const pageSize = singleObject.pageSize ? singleObject.pageSize : 10;
    const currentPage = singleObject.currentPage ? singleObject.currentPage : 1;
    return await this.dinerRepository
      .createQueryBuilder('diner')
      .select(`
        diner.id as id,
        diner.eat_date as eatDate,
        diner.morning_start as morningStart,
        diner.morning_end as morningEnd,
        diner.midday_start as middayStart,
        diner.midday_end as middayEnd,
        diner.evening_start as eveningStart,
        diner.evening_end as eveningEnd,
        diner.type as type,
        diner.booking_start as bookingStart,
        diner.booking_end as bookingEnd,
        diner.created as created,
        diner.created_id as createdId,
        diner.created_name as createdName,
        diner.last_modify as lastModify,
        diner.update_id as updateId,
        diner.update_name as updateName
      `)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('diner.created', 'DESC')
      .getRawMany();
  }

  async queryLate(): Promise<Array<DinerEntity>> {
    const searchDate = getDateStr(1)
    const dataOne = await this.dinerRepository
      .createQueryBuilder()
      .select()
      .where("eat_date = :searchDate and type = '来客'", { searchDate })
      .orderBy('created', 'DESC')
      .getOne();
    const dataTwo = await this.dinerRepository
      .createQueryBuilder()
      .select()
      .where("eat_date = :searchDate and type = '三餐'", { searchDate })
      .orderBy('created', 'DESC')
      .getOne();
    const arr = [];
    if (dataOne) {
      arr.push(dataOne)
    }
    if (dataTwo) {
      arr.push(dataTwo)
    }
    return arr;
  }
}
