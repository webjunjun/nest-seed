import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RichTextEntity } from 'src/entity/rich-text.entity';
import { InsertResult, Repository } from 'typeorm';
import { SingleCreateDto } from './dto/single-create.dto';
import { SingleDeleteDto } from './dto/single-delete.dto';
import { SingleQueryDto } from './dto/single-query.dto';
import { SingleUpdateDto } from './dto/single-update.dto';

@Injectable()
export class SingleService {
  constructor(
    @InjectRepository(RichTextEntity)
    private readonly singleRepository: Repository<RichTextEntity>
  ) {}

  async addOne(singleObject: SingleCreateDto): Promise<InsertResult> {
    return await this.singleRepository
      .createQueryBuilder()
      .insert()
      .into(RichTextEntity)
      .values({
        ...singleObject,
        created: new Date()
      })
      .execute();
  }

  async modifyOne(singleObject: SingleUpdateDto): Promise<Boolean> {
    await this.singleRepository
      .createQueryBuilder()
      .update(RichTextEntity)
      .set(singleObject)
      .where('id = :id', {id: singleObject.id})
      .execute();
    return true;
  }

  async deleteOne(singleObject: SingleDeleteDto): Promise<Boolean> {
    await this.singleRepository
      .createQueryBuilder()
      .delete()
      .from(RichTextEntity)
      .where('id = :id', {id: singleObject.id})
      .execute();
    return true;
  }

  async queryOne(singleObject: SingleQueryDto): Promise<RichTextEntity> {
    return await this.singleRepository
      .createQueryBuilder('rich_text')
      .select()
      .where({
        ...(singleObject?.id && { id: singleObject.id }),
        ...(singleObject?.type && { type: singleObject.type })
      })
      .orderBy('rich_text.created', 'DESC')
      .getOne();
  }

  async queryList(singleObject: SingleQueryDto): Promise<Array<RichTextEntity>> {
    const pageSize = singleObject.pageSize ? singleObject.pageSize : 10;
    const currentPage = singleObject.currentPage ? singleObject.currentPage : 1;
    return await this.singleRepository
      .createQueryBuilder('rich_text')
      .select(`
        rich_text.id as id,
        rich_text.title as title,
        rich_text.description as description,
        rich_text.type as type,
        rich_text.created as created,
        rich_text.created_id as createdId,
        rich_text.created_name as createdName,
        rich_text.last_modify as lastModify,
        rich_text.update_id as updateId,
        rich_text.update_name as updateName
      `)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('rich_text.created', 'DESC')
      .getRawMany();
  }
}
