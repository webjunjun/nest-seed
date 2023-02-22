import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterCodeEntity } from 'src/entity/register-code.entity';
import { Repository } from 'typeorm';

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
}
