import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HaircutEntity } from 'src/entity/haircut.entity';
import { InsertResult, Repository } from 'typeorm';
import { HaircutAddDto } from './dto/haircut-add.dto';
import { HaircutDeleteDto } from './dto/haircut-delete.dto';
import { HaircutQueryDto } from './dto/haircut-query.dto';

@Injectable()
export class HaircutService {
  constructor(
    @InjectRepository(HaircutEntity)
    private readonly haircutRepository: Repository<HaircutEntity>
  ) {}

  // 查询是否预约理发
  async resultBooking(haircutObj: HaircutQueryDto): Promise<HaircutEntity> {
    return await this.haircutRepository
      .createQueryBuilder()
      .select()
      .where('haircut_id = :haircutId AND haircut_start = :haircutStart AND haircut_end = :haircutEnd', haircutObj)
      .getOne();
  }

  async addOne(haircutObj: HaircutAddDto): Promise<boolean> {
    await this.haircutRepository
      .createQueryBuilder()
      .insert()
      .into(HaircutEntity)
      .values(haircutObj)
      .execute();
    return true
  }

  async deleteOne(haircutObj: HaircutDeleteDto): Promise<boolean> {
    await this.haircutRepository
      .createQueryBuilder()
      .delete()
      .from(HaircutEntity)
      .where('id = :id', {id: haircutObj.id})
      .execute();
    return true;
  }

  async queryList(haircutObj: HaircutQueryDto): Promise<Array<HaircutEntity>> {
    const pageSize = haircutObj.pageSize ? haircutObj.pageSize : 10;
    const currentPage = haircutObj.currentPage ? haircutObj.currentPage : 1;
    return await this.haircutRepository
      .createQueryBuilder('haircut')
      .select(`
        haircut.id as id,
        haircut.haircut_id as haircutId,
        haircut.haircut_name as haircutName,
        haircut.haircut_start as haircutStart,
        haircut.haircut_end as haircutEnd,
        haircut.created as created
      `)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('haircut.created', 'DESC')
      .getRawMany();
  }

  async queryBookingCount(haircutObj: HaircutQueryDto): Promise<number> {
    if (haircutObj.haircutStart && haircutObj.haircutEnd) {
      return await this.haircutRepository
        .createQueryBuilder('haircut')
        .select()
        .where('haircut_start >= :haircutStart AND haircut_end <= :haircutEnd', haircutObj)
        .getCount();
    } else {
      return await this.haircutRepository
        .createQueryBuilder('haircut')
        .select()
        .getCount();
    }
  }
}
