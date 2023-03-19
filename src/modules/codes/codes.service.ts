import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterCodeEntity } from 'src/entity/register-code.entity';
import { Repository } from 'typeorm';
import { CodesQueryDto } from './dto/codes-query.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(RegisterCodeEntity)
    private readonly registerCodeRepository: Repository<RegisterCodeEntity>
  ) {}

  // 批量插入注册码
  async generateCode(codeArray: Array<{
    code: string
  }>): Promise<string> {
    await this.registerCodeRepository
      .createQueryBuilder()
      .insert()
      .into(RegisterCodeEntity)
      .values(codeArray)
      .execute();
    return 'ok';
  }

  async queryList(codesObj: CodesQueryDto): Promise<Array<RegisterCodeEntity>> {
    const pageSize = codesObj.pageSize ? codesObj.pageSize : 10;
    const currentPage = codesObj.currentPage ? codesObj.currentPage : 1;
    return await this.registerCodeRepository
      .createQueryBuilder('codes')
      .select(`
        codes.id as id,
        codes.code as code,
        codes.is_used as isUsed,
        codes.use_name as useName,
        codes.use_date as useDate,
        codes.created as created
      `)
      .limit(pageSize)
      .offset(pageSize * (currentPage - 1))
      .orderBy('codes.created', 'DESC')
      .getRawMany();
  }

  async generateSixCode() {
    const keys = await this.registerCodeRepository
      .createQueryBuilder('codes')
      .select(`
        codes.code as code
      `)
      .getRawMany();
    const ukeys = [];
    keys.forEach(ele => {
      ukeys.push(ele.code)
    });
    const arr = [];
    let n = '';
    for (let i = 0; i < 4; i++) {
      n = Math.random().toString(36).substring(2, 8);
      arr.push(n.toLocaleUpperCase());
    }
    // 去重
    const arrKey = [];
    for (let m = 0; m < arr.length; m++) {
      if (ukeys.indexOf(arr[m]) == -1) {
        ukeys.push(arr[m]);
        arrKey.push({
          code: arr[m]
        })
      }
    }
    this.generateCode(arrKey);
  }
}
