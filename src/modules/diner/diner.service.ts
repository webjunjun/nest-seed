import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DinerEntity } from 'src/entity/diner.entity';
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
      .values({
        ...singleObject,
        created: new Date()
      })
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
        diner.eat_time as eatTime,
        diner.eat_type as eatType,
        diner.booking_date as bookingDate,
        diner.type as type,
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
}
