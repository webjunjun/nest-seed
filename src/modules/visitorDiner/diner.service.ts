import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitorDinerEntity } from 'src/entity/visitor-diner.entity';
import { InsertResult, Repository } from 'typeorm';
import { VisitorDinerCreateDto } from './dto/diner-create.dto';
import { VisitorDinerSearchDto } from './dto/diner-search.dto';
import { VisitorDinerUpdateDto } from './dto/diner-update.dto';

@Injectable()
export class VisitorDinerService {
  constructor(
    @InjectRepository(VisitorDinerEntity)
    private readonly visitorDinerRepository: Repository<VisitorDinerEntity>
  ) {}
  
  // 分页查询出行记录
  async queryVisitorList(pageObject: VisitorDinerSearchDto): Promise<Array<VisitorDinerEntity>> {
    const pageSize = pageObject.pageSize ? pageObject.pageSize : 10;
    const currentPage = pageObject.currentPage ? pageObject.currentPage : 1;
    let preSql = '';
    let sqlParams = {};
    if (pageObject.dinerDateStart && pageObject.dinerDateEnd) {
      preSql = 'diner_date >= :todayStart AND diner_date <= :todayEnd';
      sqlParams = {todayStart: `${pageObject.dinerDateStart} 00:00:00`, todayEnd: `${pageObject.dinerDateEnd} 23:59:59`};
    }
    return await this.visitorDinerRepository
      .createQueryBuilder('visitor_dinner')
      .select(`
        visitor_dinner.id as id,
        visitor_dinner.booker_id as bookerId,
        visitor_dinner.booker_name as bookerName,
        visitor_dinner.diner_num as dinerNum,
        visitor_dinner.diner_date as dinerDate,
        visitor_dinner.visitor_company as visitorCompany,
        visitor_dinner.visitor_level as visitorLevel,
        visitor_dinner.remark as remark,
        visitor_dinner.created as created,
        visitor_dinner.created_id as createdId,
        visitor_dinner.created_name as createdName,
        visitor_dinner.last_modify as lastModify,
        visitor_dinner.update_id as updateId,
        visitor_dinner.update_name as updateName
      `)
      .where(preSql, sqlParams)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('visitor_dinner.diner_date', 'DESC')
      .getRawMany();
  }

  // 根据出行ID查询一条出行记录
  async getVisitorDinerById(visitorId: number): Promise<VisitorDinerEntity> {
    return await this.visitorDinerRepository
      .createQueryBuilder()
      .select()
      .where("id = :id", { id: visitorId })
      .getOne();
  }

  // 新增一条出行记录
  async publishVisitorDiner(visitorInfo: VisitorDinerCreateDto): Promise<InsertResult> {
    return await this.visitorDinerRepository
      .createQueryBuilder()
      .insert()
      .into(VisitorDinerEntity)
      .values({
        ...visitorInfo,
        created: new Date()
      })
      .execute();
  }

  // 修改一条出行记录
  async modifyVisitorDiner(visitorInfo: VisitorDinerUpdateDto): Promise<Boolean> {
    await this.visitorDinerRepository
      .createQueryBuilder()
      .update(VisitorDinerEntity)
      .set(visitorInfo)
      .where('id = :id', {id: visitorInfo.id})
      .execute();
    return true;
  }

  // 删除一条出行记录
  async deleteVisitorDiner(visitorId: number): Promise<Boolean> {
    await this.visitorDinerRepository
      .createQueryBuilder()
      .delete()
      .from(VisitorDinerEntity)
      .where('id = :id', {id: visitorId})
      .execute();
    return true;
  }
}
