import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommuteItemEntity } from 'src/entity/commute-item.entity';
import { CommuteEntity } from 'src/entity/commute.entity';
import { UserEntity } from 'src/entity/user.entity';
import { InsertResult, Repository } from 'typeorm';
import { CommuteCreateDto } from './dto/commute-create.dto';
import { CommuteItemCreateDto } from './dto/commute-item-create.dto';
import { CommuteSearchDto } from './dto/commute-search.dto';
import { CommuteStatsDto } from './dto/commute-stats.dto';
import { CommuteUpdateDto } from './dto/commute-update.dto';

@Injectable()
export class CommuteService {
  constructor(
    @InjectRepository(CommuteEntity)
    private readonly commuteRepository: Repository<CommuteEntity>,
    @InjectRepository(CommuteItemEntity)
    private readonly commuteItemRepository: Repository<CommuteItemEntity>,
  ) {}

  // 分页查询出行记录
  async getCommuteList(pageObject: CommuteSearchDto): Promise<Array<CommuteEntity>> {
    const pageSize = pageObject.pageSize ? pageObject.pageSize : 10;
    const currentPage = pageObject.currentPage ? pageObject.currentPage : 1;
    return await this.commuteRepository
      .createQueryBuilder('commute')
      .leftJoinAndSelect(UserEntity, 'user', 'user.id = commute.createdId')
      .select(`
        commute.id as id,
        commute.license_plate as licensePlate,
        commute.start_addr as startAddr,
        commute.end_addr as endAddr,
        commute.pass_addr as passAddr,
        commute.seat as seat,
        commute.rest_seat as restSeat,
        commute.commute_date as commuteDate,
        commute.created as created,
        commute.created_id as createdId,
        commute.created_name as createdName,
        commute.last_modify as lastModify,
        commute.update_id as updateId,
        commute.update_name as updateName,
        user.avatar as avatar,
        user.phone as phone
      `)
      .where({
        ...(pageObject?.createdName && { createdName: pageObject.createdName }),
        ...(pageObject?.startAddr && { startAddr: pageObject.startAddr }),
        ...(pageObject?.endAddr && { endAddr: pageObject.endAddr }),
        ...(pageObject?.passAddr && { passAddr: pageObject.passAddr }),
        ...(pageObject?.commuteDate && { commuteDate: pageObject.commuteDate }),
        ...(pageObject?.createdId && { createdId: pageObject.createdId })
      })
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('commute.created', 'DESC')
      .getRawMany();
  }

  // 根据出行ID查询一条出行记录
  async getCommuteById(commuteId: number): Promise<CommuteEntity> {
    return await this.commuteRepository
      .createQueryBuilder()
      .select()
      .where("id = :id", { id: commuteId })
      .getOne();
  }

  // 新增一条出行记录
  async publishCommuteOne(commuteInfo: CommuteCreateDto): Promise<InsertResult> {
    return await this.commuteRepository
      .createQueryBuilder()
      .insert()
      .into(CommuteEntity)
      .values({
        ...commuteInfo,
        created: new Date()
      })
      .execute();
  }

  // 修改一条出行记录
  async modifyhCommuteOne(commuteInfo: CommuteUpdateDto): Promise<Boolean> {
    await this.commuteRepository
      .createQueryBuilder()
      .update(CommuteEntity)
      .set(commuteInfo)
      .where('id = :id', {id: commuteInfo.id})
      .execute();
    return true;
  }

  // 删除一条出行记录
  async deleteCommuteOne(commuteId: number): Promise<Boolean> {
    await this.commuteRepository
      .createQueryBuilder()
      .delete()
      .from(CommuteEntity)
      .where('id = :id', {id: commuteId})
      .execute();
    // 删除关联的出行预约记录
    this.commuteItemRepository
      .createQueryBuilder()
      .delete()
      .from(CommuteItemEntity)
      .where('commute_id = :commuteId', { commuteId })
      .execute();
    return true;
  }

  // 查询是否有拼车出行记录
  async queryCommuteItem(commuteItemObj: {commuteId: number, travelerId: string}): Promise<Array<CommuteItemEntity>> {
    return await this.commuteItemRepository
      .createQueryBuilder()
      .select()
      .where(
        'commute_id = :commuteId and traveler_id = :travelerId',
        commuteItemObj
      )
      .execute();
  }

  // 新增一条预约拼车出行记录
  async addCommuteItem(commuteItemInfo: CommuteItemCreateDto): Promise<InsertResult> {
    return await this.commuteItemRepository
      .createQueryBuilder()
      .insert()
      .into(CommuteItemEntity)
      .values(commuteItemInfo)
      .execute();
  }

  // 删除一条预约拼车出行记录
  async deleteCommuteItem(commuteInfo: {
    commuteId: number,
    travelerId: string
  }): Promise<Boolean> {
    await this.commuteItemRepository
      .createQueryBuilder()
      .delete()
      .from(CommuteItemEntity)
      .where('commute_id = :commuteId and traveler_id = :travelerId', commuteInfo)
      .execute();
    return true;
  }

  // 查询是否有拼车出行记录
  async queryItemList(commuteItemObj: {commuteId: number}): Promise<Array<CommuteItemEntity>> {
    return await this.commuteItemRepository
      .createQueryBuilder('commute_item')
      .select(`
        commute_item.id as id,
        commute_item.commute_id as commuteId,
        commute_item.traveler_id as travelerId,
        commute_item.traveler as traveler,
        commute_item.type as type,
        commute_item.commute_date as commuteDate,
        commute_item.created as created
      `)
      .where(
        'commute_id = :commuteId',
        commuteItemObj
      )
      .execute();
  }

  async queryStats(commuteItemObj: CommuteStatsDto): Promise<{
    publish: number,
    ping: number,
    travel: number
  }> {
    const pubNum = await this.commuteItemRepository
      .createQueryBuilder('commute_item')
      .select()
      .where(
        'traveler_id = :id AND type = "发布"',
        {id: commuteItemObj.id}
      )
      .getCount();
    const pingNum = await this.commuteItemRepository
      .createQueryBuilder('commute_item')
      .select()
      .where(
        'traveler_id = :id AND type = "拼车"',
        {id: commuteItemObj.id}
      )
      .getCount();
    const totalNum = await this.commuteItemRepository
      .createQueryBuilder('commute_item')
      .select()
      .where(
        'traveler_id = :id',
        {id: commuteItemObj.id}
      )
      .getCount();
    return {
      publish: pubNum,
      ping: pingNum,
      travel: totalNum
    }
  }
}
