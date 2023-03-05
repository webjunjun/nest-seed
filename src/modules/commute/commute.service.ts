import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommuteItemEntity } from 'src/entity/commute-item.entity';
import { CommuteEntity } from 'src/entity/commute.entity';
import { UserEntity } from 'src/entity/user.entity';
import { InsertResult, Repository } from 'typeorm';
import { CommuteCreateDto } from './dto/commute-create.dto';
import { CommuteItemCreateDto } from './dto/commute-item-create.dto';
import { CommuteSearchDto } from './dto/commute-search.dto';
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
  async getCommuteList(pageObject: CommuteSearchDto) {
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
        ...(pageObject?.commuteDate && { commuteDate: pageObject.commuteDate })
      })
      .skip(pageSize * (currentPage - 1))
      .take(pageSize * currentPage)
      .orderBy('commute.created', 'DESC')
      .getRawMany();
  }

  // 根据出行ID查询一条出行记录
  async getCommuteById(commuteId: number): Promise<CommuteEntity> {
    return this.commuteRepository
      .createQueryBuilder()
      .select()
      .where("id = :id", { id: commuteId })
      .getOne();
  }

  // 新增一条出行记录
  async publishCommuteOne(commuteInfo: CommuteCreateDto): Promise<InsertResult> {
    return this.commuteRepository
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
  async modifyhCommuteOne(commuteInfo: CommuteUpdateDto): Promise<string> {
    await this.commuteRepository
      .createQueryBuilder()
      .update(CommuteEntity)
      .set(commuteInfo)
      .where('id = :id', {id: commuteInfo.id})
      .execute();
    return 'ok';
  }

  // 删除一条出行记录
  async deleteCommuteOne(commuteId: number): Promise<string> {
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
    return 'ok'
  }

  // 查询是否有拼车出行记录
  async queryCommuteItem(commuteItemObj: {commuteId: number, travelerId: string}): Promise<string> {
    return this.commuteItemRepository
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
    return this.commuteItemRepository
      .createQueryBuilder()
      .insert()
      .into(CommuteItemEntity)
      .values(commuteItemInfo)
      .execute();
  }

  // 删除一条预约拼车出行记录
  async deleteCommuteItem(commuteItemId: string): Promise<string> {
    await this.commuteItemRepository
      .createQueryBuilder()
      .delete()
      .from(CommuteEntity)
      .where('id = :id', {id: commuteItemId})
      .execute();
    return 'ok'
  }
}
